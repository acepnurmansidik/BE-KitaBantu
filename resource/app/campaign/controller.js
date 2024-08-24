const { Op, fn, col, cast, literal, Sequelize } = require("sequelize");
const DBConn = require("../../../db");
const { globalFunc } = require("../../helper/global-func");
const { CampaignModel } = require("../../models/campaign");
const { CampaignCommentModel } = require("../../models/campaign_comment");
const { CategoryModel } = require("../../models/category");
const { DonateCampaignModel } = require("../../models/donate_campaign");
const { DonateCommentsModel } = require("../../models/donate_comments");
const { ImagesModel } = require("../../models/images");
const { OrganizerModel } = require("../../models/organizer");
const { PaymentBankModel } = require("../../models/payment_bank");
const {
  methodConstant,
  msgConstant,
  msgTypeConstant,
  emailConstant,
} = require("../../utils/constanta");
const { NotFoundError } = require("../../utils/errors");
const responseAPI = require("../../utils/response");
const { queue_push_notif } = require("../../utils/bull-setup");
const controller = {};

controller.index = async (req, res, next) => {
  try {
    /* 
    #swagger.tags = ['CAMPAIGN']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['slug'] = { description: 'this for filter campaign using category fundraising' }
    #swagger.parameters['fast_help'] = { description: 'this for filter campaign using category fundraising' }
    #swagger.parameters['limit'] = { description: 'this for filter campaign using category fundraising' }
    #swagger.parameters['page'] = { description: 'this for filter campaign using category fundraising' }
  */
    const { limit, slug, page, fast_help } = req.query;
    const offset = (page - 1) * limit;
    const result = await CampaignModel.findAll({
      where: { fast_help },
      attributes: {
        include: [
          [
            literal(
              `(SELECT CAST(COALESCE(SUM("donate_campaigns"."nominal"), 0) AS INTEGER)FROM donate_campaigns WHERE donate_campaigns.campaign_id = campaigns.id)`,
            ),
            "total_donate",
          ],
          [
            Sequelize.fn(
              "TO_CHAR",
              Sequelize.col("start_date"),
              "dd FMMonth yyyy",
            ),
            "start_date",
          ],
          [
            fn("EXTRACT", literal("DAY FROM (end_date - start_date)")),
            "deadlines",
          ],
        ],
        exclude: ["createdAt", "deletedAt", "updatedAt"],
      },
      include: [
        {
          model: CategoryModel,
          attributes: ["id", "name", "slug"],
          where: {
            slug: {
              [Op.iLike]: `%${slug ? slug : ""}%`,
            },
          },
        },
        {
          model: OrganizerModel,
          attributes: ["id", "name", "verified"],
          where: { verified: true },
          include: [
            {
              model: ImagesModel,
              attributes: ["id", "link_url"],
            },
          ],
        },
        {
          model: ImagesModel,
          attributes: ["id", "link_url"],
        },
        {
          model: CampaignCommentModel,
          attributes: ["id", "name", "comment", "date", "is_anonymous"],
        },
        {
          model: DonateCampaignModel,
          attributes: ["id", "nominal", ["createdAt", "date"]],
        },
      ],
      limit: limit ? limit : 10,
      offset,
    });

    return responseAPI.MethodResponse({
      res,
      method: methodConstant.GET,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

controller.create = async (req, res, next) => {
  const transaction = await DBConn.transaction();
  try {
    /*
      #swagger.security = [{
        "bearerAuth": []
      }]
    */
    /* 
    #swagger.tags = ['CAMPAIGN']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyCampaignSchema' }
    }
  */
    const { list_image, ...payload } = req.body;

    payload.slug_name = globalFunc.GenerateSlug(payload.campaign_name);
    payload.campaign_name = globalFunc.titleCase(payload.campaign_name);
    payload.organizer_id = req.login.organizer_id;

    const [result, duplicate] = await CampaignModel.upsert(payload, {
      transaction,
    });
    await ImagesModel.update(
      { status: true, ref_id: result.id },
      { where: { id: { [Op.in]: list_image } } },
      { transaction },
    );

    await transaction.commit();
    return responseAPI.MethodResponse({
      res,
      method: methodConstant.POST,
      data: null,
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

controller.update = async (req, res, next) => {
  const transaction = await DBConn.transaction();
  try {
    /*
        #swagger.security = [{
          "bearerAuth": []
        }]
      */
    /* 
    #swagger.tags = ['CAMPAIGN']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyCampaignSchema' }
    }
  */
    const { list_image, ...payload } = req.body;
    const id = req.params.id;

    const result = await CampaignModel.findOne({ where: { id } });
    if (!result) throw new NotFoundError(`Data with id "${id}" not found!`);

    payload.slug_name = globalFunc.GenerateSlug(payload.campaign_name);
    payload.campaign_name = globalFunc.titleCase(payload.campaign_name);

    await Promise.all([
      await CampaignModel.update(
        { ...payload },
        { where: { id } },
        { transaction },
      ),
      await ImagesModel.update(
        { status: true, ref_id: result.id },
        { where: { id: { [Op.in]: list_image } } },
        { transaction },
      ),
      await ImagesModel.update(
        { status: false },
        { where: { id: { [Op.notIn]: list_image }, ref_id: id } },
        { transaction },
      ),
      await DonateCampaignModel.update(
        {
          campaign_name: payload.campaign_name,
          slug_name: payload.slug_name,
          amount: payload.amount_require,
          description: payload.description,
        },
        { transaction },
      ),
    ]);
    await transaction.commit();
    return responseAPI.MethodResponse({
      res,
      method: methodConstant.PUT,
      data: null,
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

controller.destroy = async (req, res, next) => {
  try {
    /*
        #swagger.security = [{
          "bearerAuth": []
        }]
      */
    /* 
    #swagger.tags = ['CAMPAIGN']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
  */
    const id = req.params.id;

    const result = await CampaignModel.findOne({ where: { id } });
    if (!result) throw new NotFoundError(`Data with id "${id}" not found!`);

    await CampaignModel.update({ deletedAt: Date.now() }, { where: { id } });

    return responseAPI.MethodResponse({
      res,
      method: methodConstant.DELETE,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

controller.createUserDonateCampaign = async (req, res, next) => {
  const transaction = await DBConn.transaction();
  try {
    /*
      #swagger.security = [{
        "bearerAuth": []
      }]
    */
    /* 
    #swagger.tags = ['CAMPAIGN']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyDonateCampaignSchema' }
    }
  */
    const { bank, comment, ...payload } = req.body;
    if (req.login) payload.user_id = req.login?.user_id;

    const result = await DonateCampaignModel.create(payload, { transaction });
    await Promise.all([
      await PaymentBankModel.create(
        { ...JSON.parse(bank), donate_campaign_id: result.id },
        { transaction },
      ),
      await DonateCommentsModel.create(
        {
          comment: JSON.parse(comment).comment,
          name: req.login?.username
            ? req.login?.username
            : JSON.parse(comment).name,
          donate_campaign_id: result.id,
        },
        { transaction },
      ),
      await OrganizerModel.increment(
        "wallet_donate",
        {
          by: payload.nominal,
          where: { id: payload.organizer_id },
        },
        { transaction },
      ),
    ]);

    await transaction.commit();

    queue_push_notif.add({
      msgTypeFCM: msgTypeConstant.SINGLE,
      type: msgConstant.PAYMENT_SUCCESS,
      tokens:
        "ctkCP-6tSoqccHjKP8uWOx:APA91bHjtPTwNKu79FWpkoRO_1gNzPaU0-rsD_9Z54oT4E8QkBLiLju7UrspbDE7LdqpnrXfAtrMLQ4n7nmCtVTE068-0X-jMEvn9FRuzt71o84i1gM9oBl6lFeoZBVqy9V2wrCsRBLn",
    });

    return responseAPI.MethodResponse({
      res,
      method: methodConstant.POST,
      data: result,
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

controller.createCampaignComment = async (req, res, next) => {
  try {
    /*
      #swagger.security = [{
        "bearerAuth": []
      }]
    */
    /* 
    #swagger.tags = ['CAMPAIGN']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyCampaignCommentSchema' }
    }
  */
    const payload = req.body;
    if (req.login) {
      payload.name = req.login.username;
      payload.user_id = req.login.user_id;
    }

    await CampaignCommentModel.create(payload);

    return responseAPI.MethodResponse({
      res,
      method: methodConstant.POST,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

controller.historyPayment = async (req, res, next) => {
  try {
    /*
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
    /* 
    #swagger.tags = ['CAMPAIGN']
    #swagger.summary = 'history payment'
    #swagger.description = 'get history payment when user donate campaign'
  */
    const data = await DonateCampaignModel.findAll({
      where: { user_id: req.login.user_id },
    });

    return responseAPI.MethodResponse({
      res,
      method: methodConstant.GET,
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = controller;
