const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { CampaignModel } = require("./campaign");
const { AuthUserModel } = require("./auth");

const CampaignCommentModelDefine = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING,
    defaultValue: "ini adalah komentar",
  },
  date: {
    type: DataTypes.DATE,
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
    references: {
      model: AuthUserModel,
      key: "id",
    },
  },
};

const CampaignCommentModel = DBConn.define(
  "campaign_comments",
  CampaignCommentModelDefine,
  {
    timestamps: true,
    force: false,
    createdAt: true,
    updatedAt: true,
    paranoid: true,
  },
);

Object.keys(CampaignCommentModelDefine).map((item) => {
  CampaignCommentModelDefine[item] = CampaignCommentModelDefine[item][
    "defaultValue"
  ]
    ? CampaignCommentModelDefine[item]["defaultValue"]
    : null;
});

delete CampaignCommentModelDefine.date;
delete CampaignCommentModelDefine.user_id;
module.exports = { CampaignCommentModelDefine, CampaignCommentModel };
