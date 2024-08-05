const AuthUserSchema = require("./auth");
const CategorySchema = require("./category");
const RolesSchema = require("./roles");
const MasterBankSchema = require("./bank");

const GlobalSchema = {
  ...AuthUserSchema,
  ...CategorySchema,
  ...RolesSchema,
  ...MasterBankSchema,
};

module.exports = GlobalSchema;
