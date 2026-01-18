const { Op } = require("sequelize");
const {
  SessionBooking,
  ALLOWED_SESSION_TYPES,
} = require("../models/SessionBoking");

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
  req("preferredDate");
  req("preferredTime");
  req("sessionType");

  if (data.email !== undefined) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email));
    if (!ok) errors.push("email is invalid");
  }
  if (data.preferredDate !== undefined) {
    const d = String(data.preferredDate).trim();
    const ok = /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d));
    if (!ok) errors.push("preferredDate must be a valid YYYY-MM-DD date");
  }
  if (data.preferredTime !== undefined) {
    const t = String(data.preferredTime).trim();
    const ok = /^\d{2}:\d{2}$/.test(t);
    if (!ok) errors.push("preferredTime must be HH:MM");
  }
  if (data.sessionType !== undefined) {
    if (!ALLOWED_SESSION_TYPES.includes(String(data.sessionType).toLowerCase()))
      errors.push(
        `sessionType must be one of ${ALLOWED_SESSION_TYPES.join(", ")}`
      );
  }
  return errors;
}

async function createSession(data) {
  const errors = validatePayload(data);
  if (errors.length) throw new Error(errors.join("; "));

  const created = await SessionBooking.create({
    fullName: String(data.fullName).trim(),
    email: String(data.email).trim().toLowerCase(),
    phoneNumber:
      data.phoneNumber !== undefined && data.phoneNumber !== null
        ? String(data.phoneNumber).trim()
        : null,
    preferredDate: String(data.preferredDate).trim(),
    preferredTime: String(data.preferredTime).trim(),
    sessionType: String(data.sessionType).toLowerCase(),
  });
  return created.get({ plain: true });
}

async function getSessionById(id) {
  const found = await SessionBooking.findByPk(id, { raw: true });
  return found || null;
}

async function listSessions({
  limit = 50,
  offset = 0,
  search,
  sessionType,
  preferredDate,
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
    sessionType &&
    ALLOWED_SESSION_TYPES.includes(String(sessionType).toLowerCase())
  ) {
    and.push({ sessionType: String(sessionType).toLowerCase() });
  }
  if (preferredDate) {
    and.push({ preferredDate: String(preferredDate).trim() });
  }
  if (and.length) where[Op.and] = and;

  const rows = await SessionBooking.findAll({
    where,
    order: [["createdAt", "DESC"]],
    limit,
    offset,
    raw: true,
  });
  return rows;
}

async function updateSession(id, updates) {
  const errors = validatePayload(updates, { partial: true });
  if (errors.length) throw new Error(errors.join("; "));

  const found = await SessionBooking.findByPk(id);
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
    preferredDate:
      updates.preferredDate !== undefined
        ? String(updates.preferredDate).trim()
        : found.preferredDate,
    preferredTime:
      updates.preferredTime !== undefined
        ? String(updates.preferredTime).trim()
        : found.preferredTime,
    sessionType:
      updates.sessionType !== undefined
        ? String(updates.sessionType).toLowerCase()
        : found.sessionType,
  });
  return found.get({ plain: true });
}

async function deleteSession(id) {
  const deleted = await SessionBooking.destroy({ where: { id } });
  return deleted > 0;
}

module.exports = {
  createSession,
  getSessionById,
  listSessions,
  updateSession,
  deleteSession,
};
