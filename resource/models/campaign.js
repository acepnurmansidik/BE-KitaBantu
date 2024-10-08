const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { CategoryModel } = require("./category");
const { OrganizerModel } = require("./organizer");

const CampaignModelDefine = {
  campaign_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "peduli lingkunagan yang bersih",
  },
  slug_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: "peduli lingkunagan yang bersih",
  },
  tagline: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount_require: {
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
  fast_help:{
    type: DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: "2024-08-11T13:58:41.224Z",
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: "2024-08-31T13:58:41.000Z",
  },
  organizer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: OrganizerModel,
      key: "id",
    },
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: CategoryModel,
      key: "id",
    },
  },
};

const CampaignModel = DBConn.define("campaigns", CampaignModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

CampaignModel.belongsTo(OrganizerModel, { foreignKey: "organizer_id" });
CampaignModel.belongsTo(CategoryModel, { foreignKey: "category_id" });

Object.keys(CampaignModelDefine).map((item) => {
  CampaignModelDefine[item] = CampaignModelDefine[item]["defaultValue"]
    ? CampaignModelDefine[item]["defaultValue"]
    : null;
});

delete CampaignModelDefine.organizer_id;
delete CampaignModelDefine.slug_name;
module.exports = { CampaignModelDefine, CampaignModel };
