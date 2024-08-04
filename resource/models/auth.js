const { DataTypes } = require("sequelize");
const DBConn = require("../../db");

const AuthUserModelDefine = {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      isEmail: true, // Pastikan nilai email sesuai format email
    },
    defaultValue: "example@gmail.com",
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "example secret",
  },
  activation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
};

const AuthUserModel = DBConn.define("auth_users", AuthUserModelDefine, {
  timestamps: true,
  schema: "setting",
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

Object.keys(AuthUserModelDefine).map((item) => {
  console.log(item);
  AuthUserModelDefine[item] = AuthUserModelDefine[item]["defaultValue"]
    ? AuthUserModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { AuthUserModelDefine, AuthUserModel };
