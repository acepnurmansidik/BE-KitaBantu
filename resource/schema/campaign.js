const { CampaignModelDefine } = require("../models/campaign");
const { DonateCampaignModelDefine } = require("../models/danate_campaign");
const { PaymentBankModelDefine } = require("../models/payment_bank");

const CampaignSchema = {
  BodyCampaignSchema: CampaignModelDefine,
  BodyDonateCampaignSchema: {
    ...DonateCampaignModelDefine,
    ...PaymentBankModelDefine,
  },
};

module.exports = CampaignSchema;
