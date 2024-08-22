const { DataTypes } = require("sequelize");
const { AuthUserModel } = require("./auth");
const DBConn = require("../../db");

const OrganizerModelDefine = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: "admin",
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "jl.raya kampung rambutan",
  },
  wallet_donate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  contact_person: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: "admin@gmail.com",
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  auth_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: AuthUserModel,
      key: "id",
    },
  },
};

const OrganizerModel = DBConn.define("organizers", OrganizerModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

OrganizerModel.belongsTo(AuthUserModel, { foreignKey: "auth_id" });
AuthUserModel.hasOne(OrganizerModel, { foreignKey: "auth_id" });

Object.keys(OrganizerModelDefine).map((item) => {
  OrganizerModelDefine[item] = OrganizerModelDefine[item]["defaultValue"]
    ? OrganizerModelDefine[item]["defaultValue"]
    : null;
});

delete OrganizerModelDefine.auth_id;
delete OrganizerModelDefine.verified;
module.exports = { OrganizerModelDefine, OrganizerModel };
