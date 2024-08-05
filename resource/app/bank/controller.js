const { globalFunc } = require("../../helper/global-func");
const { BankModel } = require("../../models/bank");
const { BadRequestError, NotFoundError } = require("../../utils/errors");
const controller = {};

controller.index = async (req, res, next) => {
  try {
    /*
      #swagger.security = [{
        "bearerAuth": []
      }]
    */
    /* 
    #swagger.tags = ['MASTER BANK']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
  */
    const result = await BankModel.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    });

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
    #swagger.tags = ['MASTER BANK']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyBankSchema' }
    }
  */
    const payload = req.body;

    const [result, duplicate] = await BankModel.upsert(payload);
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
    #swagger.tags = ['MASTER BANK']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyBankSchema' }
    }
  */
    const payload = req.body;
    const id = req.params.id;

    const result = await BankModel.findOne({ where: { id } });
    if (!result) throw new NotFoundError(`Data with id "${id}" not found!`);

    await BankModel.update({ ...payload }, { where: { id } });

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
    #swagger.tags = ['MASTER BANK']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
  */
    const id = req.params.id;

    const result = await BankModel.findOne({ where: { id } });
    if (!result) throw new NotFoundError(`Data with id "${id}" not found!`);

    await BankModel.update({ deletedAt: Date.now() }, { where: { id } });
    return res
      .status(200)
      .json({ status: 200, message: "Data has been deleted!", data: null });
  } catch (err) {
    next(err);
  }
};

module.exports = controller;
