const AuthUserSchema = require("./auth");
const CategorySchema = require("./category");
const RolesSchema = require("./roles");
const MasterBankSchema = require("./bank");
const CampaignSchema = require("./campaign");

const GlobalSchema = {
  ...AuthUserSchema,
  ...CategorySchema,
  ...RolesSchema,
  ...MasterBankSchema,
  ...CampaignSchema,
};

module.exports = GlobalSchema;
