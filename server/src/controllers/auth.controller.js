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
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
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
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
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

const Notification = require("../models/Notification");
const Article = require("../models/Article");

exports.toggleFollow = async (req, res) => {
  try {
    const { targetId } = req.params;

    if (targetId === req.userId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findOne({ id: targetId });
    const currentUser = await User.findOne({ id: req.userId });

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!targetUser.followers) targetUser.followers = [];
    if (!currentUser.following) currentUser.following = [];

    const isFollowing = currentUser.following.includes(targetId);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => id !== targetId);
      targetUser.followers = targetUser.followers.filter(id => id !== req.userId);
    } else {
      currentUser.following.push(targetId);
      targetUser.followers.push(req.userId);

      await Notification.create({
        recipient: targetId,
        actor: req.userId,
        kind: "follow",
      });
    }

    await currentUser.save();
    await targetUser.save();

    res.json({ following: !isFollowing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const followingUsers = await User.find({ id: { $in: user.following || [] } })
      .select("id name username avatar bio followers");

    res.json(followingUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleBookmark = async (req, res) => {
  try {
    const { articleId } = req.params;
    const user = await User.findOne({ id: req.userId });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.bookmarks) user.bookmarks = [];

    const index = user.bookmarks.indexOf(articleId);
    let bookmarked = false;

    if (index > -1) {
      user.bookmarks.splice(index, 1);
    } else {
      user.bookmarks.push(articleId);
      bookmarked = true;
    }

    await user.save();

    res.json({ bookmarked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const articles = await Article.aggregate([
      { $match: { id: { $in: user.bookmarks || [] } } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $lookup: {
          from: "comments",
          localField: "id",
          foreignField: "articleId",
          as: "commentsList",
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          slug: 1,
          title: 1,
          excerpt: 1,
          content: 1,
          coverImage: 1,
          tags: 1,
          readTime: 1,
          status: 1,
          publishedAt: 1,
          createdAt: 1,
          likes: { $size: { $ifNull: ["$likes", []] } },
          comments: { $size: "$commentsList" },
          views: 1,
          author: {
            id: "$author.id",
            name: "$author.name",
            username: "$author.username",
            avatar: "$author.avatar",
            bio: "$author.bio",
          },
        },
      },
    ]);

    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, username, bio, avatar, email } = req.body;
    const user = await User.findOne({ id: req.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username && username !== user.username) {
      const existing = await User.findOne({ username, id: { $ne: req.userId } });
      if (existing) {
        return res.status(400).json({ message: "Username is already taken" });
      }
      user.username = username;
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (email) user.email = email;

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      bookmarks: user.bookmarks,
      following: user.following,
      followers: user.followers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
