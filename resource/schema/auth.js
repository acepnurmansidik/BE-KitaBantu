const { AuthUserModelDefine } = require("../models/auth");
const { OrganizerModelDefine } = require("../models/organizer");

const AuthUserSchema = {
  BodyAuthUserSchema: AuthUserModelDefine,
  BodyAuthSigninSchema: {
    email: "example@gmail.com",
    password: "example secret",
  },
  BodyOrganizerSchema: OrganizerModelDefine,

  QueryAuthUserSchema: {
    email: AuthUserModelDefine.email,
  },
};

module.exports = AuthUserSchema;
