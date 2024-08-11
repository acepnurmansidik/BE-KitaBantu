const { where } = require("sequelize");
const { globalFunc } = require("../../helper/global-func");
const { CategoryModel } = require("../../models/category");
const { NotFoundError } = require("../../utils/errors");
const responseAPI = require("../../utils/response");
const { methodConstant } = require("../../utils/constanta");
const controller = {};

controller.index = async (req, res, next) => {
  try {
    /* 
    #swagger.tags = ['CATEGORIES']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
  */
    const result = await CategoryModel.findAll({
      attributes: ["id", ["name", "title"], ["slug", "slug_name"]],
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
    #swagger.tags = ['CATEGORIES']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyCategorySchema' }
    }
  */
    const payload = req.body;

    payload.slug = globalFunc.GenerateSlug(payload.name);
    payload.name = globalFunc.titleCase(payload.name);

    const [result, duplicate] = await CategoryModel.upsert(payload);

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
    #swagger.tags = ['CATEGORIES']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyCategorySchema' }
    }
  */
    const payload = req.body;
    const id = req.params.id;

    const result = await CategoryModel.findOne({ where: { id } });
    if (!result) throw new NotFoundError(`Data with id "${id}" not found!`);

    payload.slug = globalFunc.GenerateSlug(payload.name);
    payload.name = globalFunc.titleCase(payload.name);
    await CategoryModel.update({ ...payload }, { where: { id } });

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
    #swagger.tags = ['CATEGORIES']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
  */
    const id = req.params.id;

    const result = await CategoryModel.findOne({ where: { id } });
    if (!result) throw new NotFoundError(`Data with id "${id}" not found!`);

    await CategoryModel.update({ deletedAt: Date.now() }, { where: { id } });

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
