const { CampaignModelDefine } = require("../models/campaign");
const { DonateCampaignModelDefine } = require("../models/donate_campaign");
const { DonateCommentsModelDefine } = require("../models/donate_comments");
const { PaymentBankModelDefine } = require("../models/payment_bank");

const CampaignSchema = {
  BodyCampaignSchema: CampaignModelDefine,
  BodyDonateCampaignSchema: {
    ...DonateCampaignModelDefine,
    bank: PaymentBankModelDefine,
    comment: DonateCommentsModelDefine,
  },
};

module.exports = CampaignSchema;
