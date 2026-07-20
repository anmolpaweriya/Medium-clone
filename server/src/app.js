const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");



const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


const authRoutes = require("./routes/auth.routes");
const articleRoutes = require("./routes/article.routes");
const commentRoutes = require("./routes/comment.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
