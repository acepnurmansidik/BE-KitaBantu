const { DataTypes } = require("sequelize");
const DBConn = require("../../db");

const BankModelDefine = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: "admin",
  },
  bank_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: "admin",
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "jl. bank borneo",
  },
  contact_number: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "adminbank@gmail.com",
  },
};

const BankModel = DBConn.define("banks", BankModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

Object.keys(BankModelDefine).map((item) => {
  BankModelDefine[item] = BankModelDefine[item]["defaultValue"]
    ? BankModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { BankModelDefine, BankModel };
