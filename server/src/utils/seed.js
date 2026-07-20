const bcrypt = require("bcrypt");
const User = require("../models/User");

async function seedAdmin() {
  try {
    const adminEmail = "admin@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("1234567890", 10);
      await User.create({
        name: "Admin User",
        username: "admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        bio: "Platform Administrator",
      });
      console.log("Admin user created successfully: admin@gmail.com");
    } else if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("Admin role assigned to existing admin@gmail.com user");
    }
  } catch (err) {
    console.error("Error seeding admin user:", err.message);
  }
}

module.exports = seedAdmin;
