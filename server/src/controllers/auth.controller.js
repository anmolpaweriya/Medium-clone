const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

exports.signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });

        const token = generateToken(user.id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(401).json({
                message: "Invalid Credentials"
            });

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match)
            return res.status(401).json({
                message: "Invalid Credentials"
            });

        const token = generateToken(user.id);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};


exports.getMe = async (req, res) => {
  const user = await User.findOne({id:req.userId}).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json(user);
};
