const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const adminController = require("../controllers/admin.controller");

router.use(auth, admin);

router.get("/stats", adminController.getStats);
router.get("/users", adminController.getUsers);
router.get("/articles", adminController.getArticles);
router.delete("/users/:id", adminController.deleteUser);
router.delete("/articles/:id", adminController.deleteArticle);
router.patch("/users/:id/role", adminController.toggleUserRole);

module.exports = router;
