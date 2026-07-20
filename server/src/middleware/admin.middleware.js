const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ id: req.userId });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
