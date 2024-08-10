const { globalFunc } = require("../../helper/global-func");
const { BankModel } = require("../../models/bank");
const { methodConstant } = require("../../utils/constanta");
const { BadRequestError, NotFoundError } = require("../../utils/errors");
const responseAPI = require("../../utils/response");
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

    return responseAPI.MethodResponse({
      res,
      method: methodConstant.POST,
      data: null,
    });
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

    return responseAPI.MethodResponse({
      res,
      method: methodConstant.PUT,
      data: null,
    });
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

    return responseAPI.MethodResponse({
      res,
      method: methodConstant.DELETE,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = controller;
