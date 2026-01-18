const { Op } = require("sequelize");
const {
  GymRegistration,
  ALLOWED_WORKOUT_TIMES,
} = require("../models/GymRegistration");

function validatePayload(data, { partial = false } = {}) {
  const errors = [];
  const req = (key) => {
    if (
      !partial &&
      (data[key] === undefined ||
        data[key] === null ||
        String(data[key]).trim() === "")
    )
      errors.push(`${key} is required`);
  };

  req("fullName");
  req("email");
  req("dateOfBirth");
  req("preferredWorkoutTime");

  if (data.email !== undefined) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email));
    if (!ok) errors.push("email is invalid");
  }
  if (data.dateOfBirth !== undefined) {
    const d = String(data.dateOfBirth).trim();
    const ok = /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d));
    if (!ok) errors.push("dateOfBirth must be a valid YYYY-MM-DD date");
  }
  if (data.currentWeight !== undefined) {
    const w = Number(data.currentWeight);
    if (Number.isNaN(w)) errors.push("currentWeight must be a number");
  }
  if (data.preferredWorkoutTime !== undefined) {
    if (
      !ALLOWED_WORKOUT_TIMES.includes(
        String(data.preferredWorkoutTime).toLowerCase()
      )
    )
      errors.push(
        `preferredWorkoutTime must be one of ${ALLOWED_WORKOUT_TIMES.join(
          ", "
        )}`
      );
  }
  return errors;
}

async function createRegistration(data) {
  const errors = validatePayload(data);
  if (errors.length) throw new Error(errors.join("; "));

  const created = await GymRegistration.create({
    fullName: String(data.fullName).trim(),
    email: String(data.email).trim().toLowerCase(),
    phoneNumber:
      data.phoneNumber !== undefined && data.phoneNumber !== null
        ? String(data.phoneNumber).trim()
        : null,
    dateOfBirth: String(data.dateOfBirth).trim(),
    currentWeight:
      data.currentWeight !== undefined && data.currentWeight !== null
        ? Number(data.currentWeight)
        : null,
    preferredWorkoutTime: String(data.preferredWorkoutTime).toLowerCase(),
  });
  return created.get({ plain: true });
}

async function getRegistrationById(id) {
  const found = await GymRegistration.findByPk(id, { raw: true });
  return found || null;
}

async function listRegistrations({
  limit = 50,
  offset = 0,
  search,
  preferredWorkoutTime,
} = {}) {
  const where = {};
  const and = [];

  if (search && String(search).trim() !== "") {
    const term = `%${String(search).trim()}%`;
    and.push({
      [Op.or]: [
        { fullName: { [Op.iLike]: term } },
        { email: { [Op.iLike]: term } },
      ],
    });
  }
  if (
    preferredWorkoutTime &&
    ALLOWED_WORKOUT_TIMES.includes(String(preferredWorkoutTime).toLowerCase())
  ) {
    and.push({
      preferredWorkoutTime: String(preferredWorkoutTime).toLowerCase(),
    });
  }
  if (and.length) where[Op.and] = and;

  const rows = await GymRegistration.findAll({
    where,
    order: [["createdAt", "DESC"]],
    limit,
    offset,
    raw: true,
  });
  return rows;
}

async function updateRegistration(id, updates) {
  const errors = validatePayload(updates, { partial: true });
  if (errors.length) throw new Error(errors.join("; "));

  const found = await GymRegistration.findByPk(id);
  if (!found) return null;

  await found.update({
    fullName:
      updates.fullName !== undefined
        ? String(updates.fullName).trim()
        : found.fullName,
    email:
      updates.email !== undefined
        ? String(updates.email).trim().toLowerCase()
        : found.email,
    phoneNumber:
      updates.phoneNumber !== undefined
        ? updates.phoneNumber === null
          ? null
          : String(updates.phoneNumber).trim()
        : found.phoneNumber,
    dateOfBirth:
      updates.dateOfBirth !== undefined
        ? String(updates.dateOfBirth).trim()
        : found.dateOfBirth,
    currentWeight:
      updates.currentWeight !== undefined
        ? updates.currentWeight === null
          ? null
          : Number(updates.currentWeight)
        : found.currentWeight,
    preferredWorkoutTime:
      updates.preferredWorkoutTime !== undefined
        ? String(updates.preferredWorkoutTime).toLowerCase()
        : found.preferredWorkoutTime,
  });
  return found.get({ plain: true });
}

async function deleteRegistration(id) {
  const deleted = await GymRegistration.destroy({ where: { id } });
  return deleted > 0;
}

module.exports = {
  createRegistration,
  getRegistrationById,
  listRegistrations,
  updateRegistration,
  deleteRegistration,
};
