const {
  createMessage: createMessageModel,
  getMessageById,
  listMessages,
  updateMessage: updateMessageModel,
  deleteMessage: deleteMessageModel,
} = require("../services/messageService");

async function createMessage(req, res, next) {
  try {
    const created = await createMessageModel(req.body || {});
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function getMessage(req, res, next) {
  try {
    const msg = await getMessageById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Not found" });
    res.json(msg);
  } catch (err) {
    next(err);
  }
}

async function listMessage(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    const { search, urgency } = req.query;
    const rows = await listMessages({ limit, offset, search, urgency });
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function updateMessage(req, res, next) {
  try {
    const updated = await updateMessageModel(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteMessage(req, res, next) {
  try {
    const ok = await deleteMessageModel(req.params.id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createMessage,
  getMessage,
  listMessage,
  updateMessage,
  deleteMessage,
};
