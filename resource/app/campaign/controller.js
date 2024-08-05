const DBConn = require("../../../db");
const { globalFunc } = require("../../helper/global-func");
const { CampaignModel } = require("../../models/campaign");
const { DonateCampaignModel } = require("../../models/donate_campaign");
const { DonateCommentsModel } = require("../../models/donate_comments");
const { PaymentBankModel } = require("../../models/payment_bank");
const { NotFoundError } = require("../../utils/errors");
const controller = {};

controller.index = async (req, res, next) => {
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
    const result = await CampaignModel.findAll();

    return res
      .status(200)
      .json({ status: 200, mesage: "Data has been retrieved", data: result });
  } catch (err) {
    next(err);
  }
};

controller.create = async (req, res, next) => {
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
    const payload = req.body;

    payload.slug_name = globalFunc.GenerateSlug(payload.campaign_name);
    payload.campaign_name = globalFunc.titleCase(payload.campaign_name);
    payload.organizer_id = req.login.organizer_id;

    const [result, duplicate] = await CampaignModel.upsert(payload);
    return res
      .status(200)
      .json({ status: 200, mesage: "Data has been created", data: result });
  } catch (err) {
    next(err);
  }
};

controller.update = async (req, res, next) => {
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
    const payload = req.body;
    const id = req.params.id;

    const result = await CampaignModel.findOne({ where: { id } });
    if (!result) throw new NotFoundError(`Data with id "${id}" not found!`);

    payload.slug_name = globalFunc.GenerateSlug(payload.campaign_name);
    payload.campaign_name = globalFunc.titleCase(payload.campaign_name);
    await CampaignModel.update({ ...payload }, { where: { id } });

    return res
      .status(200)
      .json({ status: 200, message: "Data has been updated!", data: null });
  } catch (err) {
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
    return res
      .status(200)
      .json({ status: 200, message: "Data has been deleted!", data: null });
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
    payload.user_id = req.login?.user_id;

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
    return res
      .status(200)
      .json({ status: 200, mesage: "Data has been created", data: result });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

module.exports = controller;
