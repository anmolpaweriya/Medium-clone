const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");



const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


const authRoutes = require("./routes/auth.routes");
const articleRoutes = require("./routes/article.routes");

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

module.exports = app;
