const AuthUserSchema = require("./auth");
const CategorySchema = require("./category");
const RolesSchema = require("./roles");
const MasterBankSchema = require("./bank");
const CampaignSchema = require("./campaign");
const WithdrawOraganizerSchema = require("./withdraw_organizer");

const GlobalSchema = {
  ...AuthUserSchema,
  ...CategorySchema,
  ...RolesSchema,
  ...MasterBankSchema,
  ...CampaignSchema,
  ...WithdrawOraganizerSchema,
};

module.exports = GlobalSchema;
