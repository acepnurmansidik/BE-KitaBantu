const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { OrganizerModel } = require("./organizer");
const { CampaignModel } = require("./campaign");
const { AuthUserModel } = require("./auth");

const DonateCampaignModelDefine = {
  campaign_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "peduli lingkunagan yang bersih",
  },
  slug_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "peduli lingkunagan yang bersih",
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  nominal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:
      "lingkunngan hidup yang sehat diperlukan untuk keberlangsungan hidup makhluk hidup",
  },
  organizer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: OrganizerModel,
      key: "id",
    },
  },
  campaign_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: CampaignModel,
      key: "id",
    },
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: AuthUserModel,
      key: "id",
    },
  },
};

const DonateCampaignModel = DBConn.define(
  "donate_campaigns",
  DonateCampaignModelDefine,
  {
    timestamps: true,
    force: false,
    createdAt: true,
    updatedAt: true,
    paranoid: true,
  },
);

DonateCampaignModel.belongsTo(CampaignModel, { foreignKey: "campaign_id" });
CampaignModel.hasMany(DonateCampaignModel, { foreignKey: "campaign_id" });

Object.keys(DonateCampaignModelDefine).map((item) => {
  DonateCampaignModelDefine[item] = DonateCampaignModelDefine[item][
    "defaultValue"
  ]
    ? DonateCampaignModelDefine[item]["defaultValue"]
    : null;
});

delete DonateCampaignModelDefine.user_id;
module.exports = { DonateCampaignModelDefine, DonateCampaignModel };
