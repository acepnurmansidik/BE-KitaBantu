const { DataTypes } = require("sequelize");
const DBConn = require("../../db");

// Definisi tipe enum secara eksplisit di Sequelize
const paymentStatusEnum = ["pending", "success", "failed"];

const WDWalletOrgModelDefine = {
  nominal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  bank_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "ABC",
  },
  bank_account: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  account_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payment_status: {
    type: DataTypes.ENUM(...paymentStatusEnum),
    allowNull: false,
    defaultValue: "pending",
  },
  organizer_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

const WDWalletOrgModel = DBConn.define(
  "withdraw_donation_org",
  WDWalletOrgModelDefine,
  {
    timestamps: true,
    force: false,
    createdAt: true,
    updatedAt: true,
    paranoid: true,
  },
);

delete WDWalletOrgModelDefine.payment_status;

Object.keys(WDWalletOrgModelDefine).map((item) => {
  WDWalletOrgModelDefine[item] = WDWalletOrgModelDefine[item]["defaultValue"]
    ? WDWalletOrgModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { WDWalletOrgModelDefine, WDWalletOrgModel };
