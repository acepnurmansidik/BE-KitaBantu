const { DataTypes } = require("sequelize");
const DBConn = require("../../db");

const BannerModelDefine = {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "this banner",
  },
};

const BannerModel = DBConn.define("banners", BannerModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

Object.keys(BannerModelDefine).map((item) => {
  BannerModelDefine[item] = BannerModelDefine[item]["defaultValue"]
    ? BannerModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { BannerModelDefine, BannerModel };
