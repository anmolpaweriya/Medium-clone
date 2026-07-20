const User = require("../models/User");
const Article = require("../models/Article");
const Comment = require("../models/Comment");

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalArticles = await Article.countDocuments();
    const publishedArticles = await Article.countDocuments({ status: "published" });
    const totalComments = await Comment.countDocuments();

    const viewsAggregation = await Article.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    const totalViews = viewsAggregation[0]?.totalViews || 0;

    res.json({
      totalUsers,
      totalArticles,
      publishedArticles,
      totalViews,
      totalComments,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "articles",
          localField: "id",
          foreignField: "author",
          as: "authorArticles",
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          username: 1,
          email: 1,
          role: 1,
          bio: 1,
          avatar: 1,
          followers: { $size: { $ifNull: ["$followers", []] } },
          following: { $size: { $ifNull: ["$following", []] } },
          articlesCount: { $size: "$authorArticles" },
          createdAt: 1,
        },
      },
    ]);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.aggregate([
      { $sort: { createdAt: -1 } },
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
          coverImage: 1,
          status: 1,
          readTime: 1,
          views: 1,
          publishedAt: 1,
          createdAt: 1,
          likes: { $size: { $ifNull: ["$likes", []] } },
          comments: { $size: "$commentsList" },
          author: {
            id: "$author.id",
            name: "$author.name",
            username: "$author.username",
            email: "$author.email",
            avatar: "$author.avatar",
          },
        },
      },
    ]);

    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.userId) {
      return res.status(400).json({ message: "You cannot delete your own admin account." });
    }

    const user = await User.findOneAndDelete({ id });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete user's articles and comments
    await Article.deleteMany({ author: id });
    await Comment.deleteMany({ userId: id });

    res.json({ message: "User and associated content deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findOneAndDelete({ id });
    if (!article) {
      return res.status(404).json({ message: "Article not found." });
    }

    await Comment.deleteMany({ articleId: id });

    res.json({ message: "Article deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleUserRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.userId) {
      return res.status(400).json({ message: "You cannot modify your own admin role." });
    }

    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
