const { DataTypes } = require("sequelize");
const DBConn = require("../../db");

const CategoryModelDefine = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: "example secret",
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "example-secret",
  },
};

const CategoryModel = DBConn.define("categories", CategoryModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

Object.keys(CategoryModelDefine).map((item) => {
  CategoryModelDefine[item] = CategoryModelDefine[item]["defaultValue"]
    ? CategoryModelDefine[item]["defaultValue"]
    : null;
});

delete CategoryModelDefine.slug;
module.exports = { CategoryModelDefine, CategoryModel };
