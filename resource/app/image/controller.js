const responseAPI = require("../../utils/response");
const { methodConstant } = require("../../utils/constanta");
const DBConn = require("../../../db");
const { ImagesModel } = require("../../models/images");

const controller = {};

controller.uploadFile = async (req, res, next) => {
  const transaction = await DBConn.transaction();
  try {
    /*
      #swagger.security = [{
        "bearerAuth": []
      }]
    */
    /* 
    #swagger.tags = ['UPLOAD FILE']
    #swagger.summary = 'upload file'
    #swagger.description = 'this rest API for purpose upload file'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['multFiles'] = {
            in: 'formData',
            type: 'array',
            required: true,
            description: 'Some description...',
            collectionFormat: 'multi',
            items: { type: 'file' }
        }
  */
    const files = req.files;
    const data = [];
    for (image of files) {
      let result = await ImagesModel.create(
        { link_url: image.path },
        { transaction },
      );
      data.push(result.toJSON().id);
    }

    await transaction.commit();
    return responseAPI.MethodResponse({
      res,
      method: methodConstant.GET,
      data: data,
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

module.exports = controller;
