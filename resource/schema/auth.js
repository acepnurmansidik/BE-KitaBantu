const { AuthUserModelDefine } = require("../models/auth");

const AuthUserSchema = {
  BodyAuthUserSchema: AuthUserModelDefine,
  QueryAuthUserSchema: {
    email: AuthUserModelDefine.email,
  },
};

module.exports = AuthUserSchema;
