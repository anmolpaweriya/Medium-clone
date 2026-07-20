const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  getMe,
  toggleFollow,
  getFollowing,
  toggleBookmark,
  getBookmarks,
  updateProfile,
} = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, getMe);
router.patch("/profile", auth, updateProfile);

router.post("/follow/:targetId", auth, toggleFollow);
router.get("/following", auth, getFollowing);
router.post("/bookmark/:articleId", auth, toggleBookmark);
router.get("/bookmarks", auth, getBookmarks);

module.exports = router;
