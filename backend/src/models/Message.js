const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelize");

const ALLOWED_URGENCY = ["high", "medium", "low"];

const Message = sequelize.define(
  "Message",
  {
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    subject: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: true },
    urgency: { type: DataTypes.ENUM(...ALLOWED_URGENCY), allowNull: false },
  },
  {
    tableName: "messages",
    underscored: true,
    timestamps: true,
  }
);

async function initMessageModel() {
  await Message.sync();
}

module.exports = {
  ALLOWED_URGENCY,
  Message,
  initMessageModel,
};
