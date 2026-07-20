const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
    createArticle,
    updateArticle,
    getArticle,
    getFeed,
    getFollowingFeed,
    getTopicsFeed,
    getMyArticles,
    deleteArticle,
    getHome,
    toggleLike,
    getTrendingFeed,
} = require("../controllers/article.controller");


router.get("/home", getHome);
router.get("/trending", getTrendingFeed);
router.post("/", auth, createArticle);
router.post("/:id/like", auth, toggleLike);
router.patch("/:id", auth, updateArticle);
router.get("/me", auth, getMyArticles);
router.get("/following", auth, getFollowingFeed);
router.get("/topics", auth, getTopicsFeed);
router.get("/:slug", getArticle);
router.get("/", getFeed);
router.delete("/:id", auth, deleteArticle);

module.exports = router;
