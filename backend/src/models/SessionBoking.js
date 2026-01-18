const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelize");

const ALLOWED_SESSION_TYPES = ["personal", "group", "virtual"];

const SessionBooking = sequelize.define(
  "SessionBooking",
  {
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    phoneNumber: { type: DataTypes.STRING, allowNull: true },
    preferredDate: { type: DataTypes.DATEONLY, allowNull: false },
    preferredTime: { type: DataTypes.STRING, allowNull: false }, // e.g., HH:MM
    sessionType: {
      type: DataTypes.ENUM(...ALLOWED_SESSION_TYPES),
      allowNull: false,
    },
  },
  {
    tableName: "session_bookings",
    underscored: true,
    timestamps: true,
  }
);

async function initSessionBookingModel() {
  await SessionBooking.sync();
}

module.exports = {
  ALLOWED_SESSION_TYPES,
  SessionBooking,
  initSessionBookingModel,
};
