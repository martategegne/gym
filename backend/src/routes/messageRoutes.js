const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessage,
  listMessage,
  updateMessage,
  deleteMessage,
} = require("../controllers/messageController");

router.post("/", createMessage);
router.get("/", listMessage);
router.get("/:id", getMessage);
router.patch("/:id", updateMessage);
router.delete("/:id", deleteMessage);

module.exports = router;
