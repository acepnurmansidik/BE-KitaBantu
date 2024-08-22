const responseAPI = require("../../utils/response");
const { WDWalletOrgModel } = require("../../models/withdraw_donation_org");
const { methodConstant } = require("../../utils/constanta");
const { OrganizerModel } = require("../../models/organizer");
const DBConn = require("../../../db");

const controller = {};

controller.index = async (req, res, next) => {
  try {
    /*
      #swagger.security = [{
        "bearerAuth": []
      }]
    */
    /* 
    #swagger.tags = ['WD ORGANIZER']
    #swagger.summary = 'filter every withdraw'
    #swagger.description = 'this for filter campaign using category fundraising'
  */

    // const filter=req.login
    let filter = {};
    if (req.login.role_name == "Ultramen") {
      filter = { payment_status: "pending" };
    }

    const result = await WDWalletOrgModel.findAll({
      where: filter,
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
    #swagger.tags = ['WD ORGANIZER']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyWithdrawOraganizerSchema' }
    }
  */
    const payload = req.body;

    const organizer = await OrganizerModel.findOne({
      where: { id: payload.organizer_id },
      attributes: ["id", "wallet_donate"],
      raw: true,
    });

    if (
      organizer.wallet_donate < payload.nominal ||
      organizer.wallet_donate == 0
    ) {
      await transaction.rollback();
      return responseAPI.MethodResponse({
        res,
        method: methodConstant.BAD_REQUEST,
        data: null,
      });
    }

    await Promise.all([
      await OrganizerModel.decrement(
        "wallet_donate",
        {
          by: payload.nominal,
          where: { id: payload.organizer_id },
        },
        { transaction },
      ),
      await WDWalletOrgModel.create(payload, { transaction }),
    ]);

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
  try {
    /*
      #swagger.security = [{
        "bearerAuth": []
      }]
    */
    /* 
    #swagger.tags = ['WD ORGANIZER']
    #swagger.summary = 'filter every campaign'
    #swagger.description = 'this for filter campaign using category fundraising'
    #swagger.parameters['status'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyApprovedWithdrawOraganizerSchema' }
    }
  */
    const id = req.params;
    const payment_status = req.body.status == true ? "success" : "failed";

    await WDWalletOrgModel.update({ payment_status }, { where: id });

    return responseAPI.MethodResponse({
      res,
      method: methodConstant.PUT,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = controller;
