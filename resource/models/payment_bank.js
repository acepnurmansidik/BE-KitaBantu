const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { DonateCampaignModel } = require("./donate_campaign");

const PaymentBankModelDefine = {
  bank_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: "example secret",
  },
  account_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: "example name",
  },
  account_number: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "1773472375472",
  },
  donate_campaign_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: DonateCampaignModel,
      key: "id",
    },
  },
};

const PaymentBankModel = DBConn.define(
  "payment_banks",
  PaymentBankModelDefine,
  {
    timestamps: true,
    force: false,
    createdAt: true,
    updatedAt: true,
    paranoid: true,
  },
);

Object.keys(PaymentBankModelDefine).map((item) => {
  PaymentBankModelDefine[item] = PaymentBankModelDefine[item]["defaultValue"]
    ? PaymentBankModelDefine[item]["defaultValue"]
    : null;
});

delete PaymentBankModelDefine.donate_campaign_id;
module.exports = { PaymentBankModelDefine, PaymentBankModel };
