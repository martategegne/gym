const {
  createSession,
  getSessionById,
  listSessions,
  updateSession,
  deleteSession,
} = require("../services/sessionBookingService");

async function create(req, res, next) {
  try {
    const created = await createSession(req.body || {});
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const item = await getSessionById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    const { search, sessionType, preferredDate } = req.query;
    const rows = await listSessions({
      limit,
      offset,
      search,
      sessionType,
      preferredDate,
    });
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const updated = await updateSession(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const ok = await deleteSession(req.params.id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  get,
  list,
  update,
  remove,
};
