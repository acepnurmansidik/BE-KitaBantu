const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { CampaignModel } = require("./campaign");
const { OrganizerModel } = require("./organizer");

const ImagesModelDefine = {
  link_url: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "example secret",
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  ref_id: {
    type: DataTypes.UUID,
  },
};

const ImagesModel = DBConn.define("images", ImagesModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

ImagesModel.belongsTo(CampaignModel, { foreignKey: "ref_id" });
CampaignModel.hasMany(ImagesModel, { foreignKey: "ref_id" });

ImagesModel.belongsTo(OrganizerModel, { foreignKey: "ref_id" });
OrganizerModel.hasOne(ImagesModel, { foreignKey: "ref_id" });

Object.keys(ImagesModelDefine).map((item) => {
  ImagesModelDefine[item] = ImagesModelDefine[item]["defaultValue"]
    ? ImagesModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { ImagesModelDefine, ImagesModel };
