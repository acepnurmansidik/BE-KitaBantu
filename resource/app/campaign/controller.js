const { Op } = require("sequelize");
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
const { methodConstant } = require("../../utils/constanta");
const { NotFoundError } = require("../../utils/errors");
const responseAPI = require("../../utils/response");
const controller = {};

controller.index = async (req, res, next) => {
  try {
    /* 
    #swagger.tags = ['CAMPAIGN']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
  */
    const result = await CampaignModel.findAll({
      include: [
        {
          model: CategoryModel,
          attributes: ["id", "name", "slug"],
        },
        {
          model: OrganizerModel,
          attributes: ["id", "name"],
        },
        {
          model: ImagesModel,
          attributes: ["id", "link_url"],
          where: {
            status: true,
          },
        },
      ],
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "deletedAt",
          "organizer_id",
          "category_id",
        ],
      },
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
        { ...bank, donate_campaign_id: result.id },
        { transaction },
      ),
      await DonateCommentsModel.create(
        {
          comment: comment.comment,
          name: req.login?.username ? req.login?.username : comment.name,
          donate_campaign_id: result.id,
        },
        { transaction },
      ),
    ]);

    await transaction.commit();

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

module.exports = controller;
