const { WDWalletOrgModelDefine } = require("../models/withdraw_donation_org");

const WithdrawOraganizerSchema = {
  BodyWithdrawOraganizerSchema: WDWalletOrgModelDefine,
  BodyApprovedWithdrawOraganizerSchema: { status: true },
};

module.exports = WithdrawOraganizerSchema;
