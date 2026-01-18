const {
  createRegistration,
  getRegistrationById,
  listRegistrations,
  updateRegistration,
  deleteRegistration,
} = require("../services/gymRegistrationService");

async function create(req, res, next) {
  try {
    const created = await createRegistration(req.body || {});
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const reg = await getRegistrationById(req.params.id);
    if (!reg) return res.status(404).json({ error: "Not found" });
    res.json(reg);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    const { search, preferredWorkoutTime } = req.query;
    const rows = await listRegistrations({
      limit,
      offset,
      search,
      preferredWorkoutTime,
    });
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const updated = await updateRegistration(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const ok = await deleteRegistration(req.params.id);
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
