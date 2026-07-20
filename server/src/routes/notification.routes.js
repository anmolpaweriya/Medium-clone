const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
  getNotifications,
  markRead,
} = require("../controllers/notification.controller");

router.get("/", auth, getNotifications);
router.patch("/read", auth, markRead);

module.exports = router;
