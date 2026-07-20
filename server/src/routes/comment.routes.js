const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
  createComment,
  getArticleComments,
  deleteComment,
} = require("../controllers/comment.controller");

router.post("/", auth, createComment);
router.get("/article/:articleId", getArticleComments);
router.delete("/:id", auth, deleteComment);

module.exports = router;
