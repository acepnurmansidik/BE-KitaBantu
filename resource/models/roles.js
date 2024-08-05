const { DataTypes } = require("sequelize");
const DBConn = require("../../db");

const RolesModelDefine = {
  role_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: "admin",
  },
};

const RolesModel = DBConn.define("roles", RolesModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

Object.keys(RolesModelDefine).map((item) => {
  RolesModelDefine[item] = RolesModelDefine[item]["defaultValue"]
    ? RolesModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { RolesModelDefine, RolesModel };
