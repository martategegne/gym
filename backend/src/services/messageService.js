const { Op } = require("sequelize");
const { Message, ALLOWED_URGENCY } = require("../models/Message");

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
  req("subject");
  req("message");
  req("urgency");

  if (data.email !== undefined) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email));
    if (!ok) errors.push("email is invalid");
  }
  if (data.urgency !== undefined) {
    if (!ALLOWED_URGENCY.includes(String(data.urgency).toLowerCase()))
      errors.push(`urgency must be one of ${ALLOWED_URGENCY.join(", ")}`);
  }
  return errors;
}

async function createMessage(data) {
  const errors = validatePayload(data);
  if (errors.length) throw new Error(errors.join("; "));

  const created = await Message.create({
    fullName: String(data.fullName).trim(),
    email: String(data.email).trim().toLowerCase(),
    subject: String(data.subject).trim(),
    message: String(data.message).trim(),
    phoneNumber:
      data.phoneNumber !== undefined && data.phoneNumber !== null
        ? String(data.phoneNumber).trim()
        : null,
    urgency: String(data.urgency).toLowerCase(),
  });
  return created.get({ plain: true });
}

async function getMessageById(id) {
  const found = await Message.findByPk(id, { raw: true });
  return found || null;
}

async function listMessages({ limit = 50, offset = 0, search, urgency } = {}) {
  const where = {};
  const and = [];

  if (search && String(search).trim() !== "") {
    const term = `%${String(search).trim()}%`;
    and.push({
      [Op.or]: [
        { fullName: { [Op.iLike]: term } },
        { email: { [Op.iLike]: term } },
        { subject: { [Op.iLike]: term } },
      ],
    });
  }
  if (urgency && ALLOWED_URGENCY.includes(String(urgency).toLowerCase())) {
    and.push({ urgency: String(urgency).toLowerCase() });
  }
  if (and.length) where[Op.and] = and;

  const rows = await Message.findAll({
    where,
    order: [["createdAt", "DESC"]],
    limit,
    offset,
    raw: true,
  });
  return rows;
}

async function updateMessage(id, updates) {
  const errors = validatePayload(updates, { partial: true });
  if (errors.length) throw new Error(errors.join("; "));

  const found = await Message.findByPk(id);
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
    subject:
      updates.subject !== undefined
        ? String(updates.subject).trim()
        : found.subject,
    message:
      updates.message !== undefined
        ? String(updates.message).trim()
        : found.message,
    phoneNumber:
      updates.phoneNumber !== undefined
        ? updates.phoneNumber === null
          ? null
          : String(updates.phoneNumber).trim()
        : found.phoneNumber,
    urgency:
      updates.urgency !== undefined
        ? String(updates.urgency).toLowerCase()
        : found.urgency,
  });
  return found.get({ plain: true });
}

async function deleteMessage(id) {
  const deleted = await Message.destroy({ where: { id } });
  return deleted > 0;
}

module.exports = {
  createMessage,
  getMessageById,
  listMessages,
  updateMessage,
  deleteMessage,
};
