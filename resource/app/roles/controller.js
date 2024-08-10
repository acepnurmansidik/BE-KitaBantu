const { globalFunc } = require("../../helper/global-func");
const { RolesModel } = require("../../models/roles");
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
    /* 
    #swagger.tags = ['ROLE USER']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
  */
    const result = await RolesModel.findAll({
      attributes: ["id", "role_name"],
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
    #swagger.tags = ['ROLE USER']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyRolesSchema' }
    }
  */
    const payload = req.body;

    payload.role_name = globalFunc.titleCase(payload.role_name);

    const [result, duplicate] = await RolesModel.upsert(payload);

    return responseAPI.MethodResponse({
      res,
      method: methodConstant.POST,
      data: result,
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
    #swagger.tags = ['ROLE USER']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyRolesSchema' }
    }
  */
    const payload = req.body;
    const id = req.params.id;

    payload.role_name = globalFunc.titleCase(payload.role_name);

    const result = await RolesModel.findOne({ where: { id } });
    if (!result) throw new NotFoundError(`Data with id "${id}" not found!`);

    payload.slug = globalFunc.GenerateSlug(payload.name);
    await RolesModel.update({ ...payload }, { where: { id } });

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
    #swagger.tags = ['ROLE USER']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
  */
    const id = req.params.id;

    const result = await RolesModel.findOne({ where: { id } });
    if (!result) throw new NotFoundError(`Data with id "${id}" not found!`);

    await RolesModel.update({ deletedAt: Date.now() }, { where: { id } });

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
