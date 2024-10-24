const { BannerModel } = require("../../models/banner");
const { NotFoundError } = require("../../utils/errors");
const responseAPI = require("../../utils/response");
const { methodConstant } = require("../../utils/constanta");
const DBConn = require("../../../db");
const { ImagesModel } = require("../../models/images");
const controller = {};

controller.index = async (req, res, next) => {
  try {
    /* 
      #swagger.tags = ['BANNER']
      #swagger.summary = 'filter every campaign'
      #swagger.description = 'this for filter campaign using category fundraising'
    */
    const result = await BannerModel.findAll({
      attributes: ["id", "title"],
      include: {
        model: ImagesModel,
        attributes: ["id", "link_url"],
        where: { status: true },
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
    #swagger.tags = ['BANNER']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyBannerSchema' }
    }
  */
    const { image, ...payload } = req.body;

    const [result, duplicate] = await BannerModel.upsert(payload, {
      transaction,
    });
    await ImagesModel.update(
      { status: true, ref_id: result.toJSON().id },
      { where: { id: image } },
      { transaction },
    );

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

controller.update = async (req, res, next) => {
  const transaction = await DBConn.transaction();
  try {
    /*
      #swagger.security = [{
        "bearerAuth": []
      }]
    */
    /* 
    #swagger.tags = ['BANNER']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyBannerSchema' }
    }
  */
    const { image, ...payload } = req.body;
    const id = req.params.id;

    const result = await BannerModel.findOne({ where: { id } });
    if (!result) throw new NotFoundError(`Data with id "${id}" not found!`);

    await Promise.all([
      await BannerModel.update(
        { ...payload },
        { where: { id } },
        { transaction },
      ),
      await ImagesModel.update(
        { status: false },
        { where: { ref_id: result.toJSON().id } },
        { transaction },
      ),
      await ImagesModel.create(
        { status: true, ref_id: result.toJSON().id },
        { where: { id: image } },
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
    #swagger.tags = ['BANNER']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
  */
    const id = req.params.id;

    const result = await BannerModel.findOne({ where: { id } });
    if (!result) throw new NotFoundError(`Data with id "${id}" not found!`);

    await BannerModel.update({ deletedAt: Date.now() }, { where: { id } });

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
