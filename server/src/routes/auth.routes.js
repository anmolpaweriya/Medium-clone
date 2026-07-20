const express = require("express");

const router = express.Router();

const {
    signup,
  login,
  getMe
} = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, getMe);



module.exports = router;
