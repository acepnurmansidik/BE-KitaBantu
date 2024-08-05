const { globalFunc } = require("../../helper/global-func");
const { AuthUserModel } = require("../../models/auth");
const bcrypt = require("bcrypt");
const { BadRequestError, NotFoundError } = require("../../utils/errors/index");
const response = require("../../utils/response");
const { methodConstant } = require("../../utils/constanta");

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

    let result = await AuthUserModel.findOne({ email: payload.email });
    if (result) throw new NotFoundError("Data has register");

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
      schema: { $ref: '#/definitions/BodyAuthUserSchema' }
    }
  */
  try {
    const { email, password } = req.body;
    // check body
    if (!email || !password)
      throw new BadRequestError("Credentials is invalid");
    // get data from databse by email
    const data = await AuthUserModel.findOne({
      where: { email },
      attributes: ["password", "email"],
    });

    // compare password from input with saving database
    const isMatch = await globalFunc.verifyPassword({
      hashPassword: data.password,
      password,
    });
    // send error password no match
    if (!isMatch) throw new BadRequestError("Credentials is invalid");

    // create JWT token for response
    const result = await globalFunc.generateJwtToken(data.toJSON());

    response.MethodResponse(res, methodConstant.GET, result);
  } catch (err) {
    next(err);
  }
};

module.exports = controller;
