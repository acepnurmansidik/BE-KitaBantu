const { where } = require("sequelize");
const { globalFunc } = require("../../helper/global-func");
const { CategoryModel } = require("../../models/category");
const { BadRequestError, NotFoundError } = require("../../utils/errors");
const controller = {};

controller.index = async (req, res, next) => {
  try {
    /* 
    #swagger.tags = ['Setting Category']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
  */
    const result = await CategoryModel.findAll({
      attributes: ["id", ["name", "title"], ["slug", "slug_name"]],
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
    //     /*
    //     #swagger.security = [{
    //       "bearerAuth": []
    //     }]
    //   */
    /* 
    #swagger.tags = ['Setting Category']
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

    const [result, duplicate] = await CategoryModel.upsert(payload);
    if (!duplicate) throw new BadRequestError("Data is duplicate!");
    return res
      .status(200)
      .json({ status: 200, mesage: "Data has been created", data: result });
  } catch (err) {
    next(err);
  }
};

controller.update = async (req, res, next) => {
  try {
    //     /*
    //     #swagger.security = [{
    //       "bearerAuth": []
    //     }]
    //   */
    /* 
    #swagger.tags = ['Setting Category']
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
    await CategoryModel.update({ ...payload }, { where: { id } });

    return res
      .status(200)
      .json({ status: 200, message: "Data has been updated!", data: null });
  } catch (err) {
    next(err);
  }
};

controller.destroy = async (req, res, next) => {
  try {
    //     /*
    //     #swagger.security = [{
    //       "bearerAuth": []
    //     }]
    //   */
    /* 
    #swagger.tags = ['Setting Category']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
  */
    const id = req.params.id;

    const result = await CategoryModel.findOne({ where: { id } });
    if (!result) throw new NotFoundError(`Data with id "${id}" not found!`);

    await CategoryModel.update({ deletedAt: Date.now() }, { where: { id } });
    return res
      .status(200)
      .json({ status: 200, message: "Data has been deleted!", data: null });
  } catch (err) {
    next(err);
  }
};

module.exports = controller;
