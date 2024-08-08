const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { RolesModel } = require("./roles");

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
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "example secret",
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "example secret",
  },
  device_token: {
    type: DataTypes.TEXT,
    defaultValue: "token",
  },
  activation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: RolesModel,
      key: "id",
    },
  },
};

const AuthUserModel = DBConn.define("auth_users", AuthUserModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

AuthUserModel.belongsTo(RolesModel, { foreignKey: "role_id" });
RolesModel.hasMany(AuthUserModel, { foreignKey: "role_id" });

Object.keys(AuthUserModelDefine).map((item) => {
  AuthUserModelDefine[item] = AuthUserModelDefine[item]["defaultValue"]
    ? AuthUserModelDefine[item]["defaultValue"]
    : null;
});

delete AuthUserModelDefine.activation;
delete AuthUserModelDefine.role_id;
module.exports = { AuthUserModelDefine, AuthUserModel };
