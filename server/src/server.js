require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const seedAdmin = require("./utils/seed");

connectDB().then(() => {
    seedAdmin();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
