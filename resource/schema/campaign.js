const { CampaignModelDefine } = require("../models/campaign");
const { CampaignCommentModelDefine } = require("../models/campaign_comment");
const { DonateCampaignModelDefine } = require("../models/donate_campaign");
const { DonateCommentsModelDefine } = require("../models/donate_comments");
const { PaymentBankModelDefine } = require("../models/payment_bank");

const CampaignSchema = {
  BodyCampaignSchema: { ...CampaignModelDefine, list_image: [] },
  BodyDonateCampaignSchema: {
    ...DonateCampaignModelDefine,
    bank: PaymentBankModelDefine,
    comment: DonateCommentsModelDefine,
  },
  BodyCampaignCommentSchema: CampaignCommentModelDefine,
};

module.exports = CampaignSchema;
