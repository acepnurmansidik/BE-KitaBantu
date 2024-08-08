const { globalFunc } = require("../../helper/global-func");
const { AuthUserModel } = require("../../models/auth");
const { BadRequestError, NotFoundError } = require("../../utils/errors/index");
const response = require("../../utils/response");
const { methodConstant } = require("../../utils/constanta");
const { OrganizerModel } = require("../../models/organizer");
const { RolesModel } = require("../../models/roles");
const { Op } = require("sequelize");
const DBConn = require("../../../db");

const controller = {};
controller.Register = async (req, res, next) => {
  /* 
    #swagger.tags = ['Master Role']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyAuthUserSchema' }
    }
  */
  try {
    const payload = req.body;
    payload.password = await globalFunc.hashPassword({ ...payload });

    let [result, role] = await Promise.all([
      AuthUserModel.findOne({
        where: { email: payload.email },
      }),
      RolesModel.findOne({
        where: { role_name: { [Op.iLike]: "%guest%" } },
      }),
    ]);

    if (result) throw new BadRequestError("Account has register");

    payload.role_id = role.id;
    result = await AuthUserModel.create(payload);

    delete payload.password;
    return res.status(200).json({ status: 200, result });
  } catch (err) {
    next(err);
  }
};

controller.Login = async (req, res, next) => {
  /* 
    #swagger.tags = ['Master Role']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyAuthSigninSchema' }
    }
  */
  try {
    const { email, password, device_token } = req.body;
    // check body
    if (!email || !password)
      throw new BadRequestError("Credentials is invalid");
    // get data from databse by email
    const data = await AuthUserModel.findOne({
      where: { email },
      attributes: ["email", "password"],
    });

    if (!data) throw new NotFoundError("Account not register");

    // compare password from input with saving database
    const isMatch = await globalFunc.verifyPassword({
      hashPassword: data.password,
      password,
    });
    // send error password no match
    if (!isMatch) throw new BadRequestError("Credentials is invalid");

    // create JWT token for response
    const result = await globalFunc.generateJwtToken(data.toJSON());
    await AuthUserModel.update({ device_token }, { where: { email } });

    response.MethodResponse(res, methodConstant.GET, result);
  } catch (err) {
    next(err);
  }
};

controller.Organizer = async (req, res, next) => {
  try {
    /*
      #swagger.security = [{
        "bearerAuth": []
      }]
    */
    /* 
    #swagger.tags = ['Master Role']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyOrganizerSchema' }
    }
  */

    const payload = req.body;

    payload.auth_id = req.login.id;

    const [result, duplicate] = await OrganizerModel.upsert(payload);

    return res.status(200).json({ status: 200, result });
  } catch (err) {
    next(err);
  }
};

controller.verifyOrganizer = async (req, res, next) => {
  const transaction = await DBConn.transaction();
  try {
    /*
      #swagger.security = [{
        "bearerAuth": []
      }]
    */
    /* 
    #swagger.tags = ['Master Role']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
  */
    const { id } = req.params;

    const [user, role] = await Promise.all([
      OrganizerModel.findOne({
        where: { id },
        include: {
          model: AuthUserModel,
        },
      }),
      RolesModel.findOne({
        where: { role_name: { [Op.iLike]: "%organizer%" } },
      }),
    ]);

    await Promise.all([
      OrganizerModel.update(
        { verified: true },
        { where: { id } },
        { transaction },
      ),
      AuthUserModel.update(
        { role_id: role.id },
        { where: { id: user.auth_user.id } },
        { transaction },
      ),
    ]);

    await transaction.commit();

    return res.status(200).json({
      status: 200,
      message: "Organizer has been verified",
      data: null,
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

controller.onRefreshTokenDevice = async (req, res, next) => {
  /*
      #swagger.security = [{
        "bearerAuth": []
      }]
    */
  /* 
    #swagger.tags = ['Master Role']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyDeviceTokenSchema' }
    }
  */
  try {
    await AuthUserModel.update(
      { device_token: req.body.device_token },
      { where: { email: req.login.email } },
    );
    return res.status(200).json({
      status: 201,
      message: "Data has been update",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = controller;
