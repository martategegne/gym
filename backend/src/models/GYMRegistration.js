const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelize");

const ALLOWED_WORKOUT_TIMES = ["morning", "afternoon", "evening"];

const GymRegistration = sequelize.define(
  "GymRegistration",
  {
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    phoneNumber: { type: DataTypes.STRING, allowNull: true },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: false },
    currentWeight: { type: DataTypes.FLOAT, allowNull: true },
    preferredWorkoutTime: {
      type: DataTypes.ENUM(...ALLOWED_WORKOUT_TIMES),
      allowNull: false,
    },
  },
  {
    tableName: "gym_registrations",
    underscored: true,
    timestamps: true,
  }
);

async function initGymRegistrationModel() {
  await GymRegistration.sync();
}

module.exports = {
  ALLOWED_WORKOUT_TIMES,
  GymRegistration,
  initGymRegistrationModel,
};
