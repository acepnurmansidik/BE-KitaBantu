const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { DonateCampaignModel } = require("./donate_campaign");

const DonateCommentsModelDefine = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING,
    defaultValue: "example secret",
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: Date.now(),
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

const DonateCommentsModel = DBConn.define(
  "donate_comments",
  DonateCommentsModelDefine,
  {
    timestamps: true,
    force: false,
    createdAt: true,
    updatedAt: true,
    paranoid: true,
  },
);

DonateCommentsModel.belongsTo(DonateCampaignModel, {
  foreignKey: "donate_campaign_id",
});
DonateCampaignModel.hasMany(DonateCommentsModel, {
  foreignKey: "donate_campaign_id",
});

Object.keys(DonateCommentsModelDefine).map((item) => {
  DonateCommentsModelDefine[item] = DonateCommentsModelDefine[item][
    "defaultValue"
  ]
    ? DonateCommentsModelDefine[item]["defaultValue"]
    : null;
});

delete DonateCommentsModelDefine.date;
delete DonateCommentsModelDefine.donate_campaign_id;
module.exports = { DonateCommentsModelDefine, DonateCommentsModel };
