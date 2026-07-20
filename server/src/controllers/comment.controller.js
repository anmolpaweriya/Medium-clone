const Comment = require("../models/Comment");
const Article = require("../models/Article");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.createComment = async (req, res) => {
  try {
    const { articleId, content } = req.body;

    if (!articleId || !content) {
      return res.status(400).json({ message: "Article ID and content are required" });
    }

    const article = await Article.findOne({ id: articleId });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const comment = await Comment.create({
      articleId,
      userId: req.userId,
      content,
    });

    // Notify author if comment was made by someone else
    if (article.author && article.author !== req.userId) {
      await Notification.create({
        recipient: article.author,
        actor: req.userId,
        kind: "comment",
        articleId: article.id,
      });
    }

    const user = await User.findOne({ id: req.userId }).select("id name username avatar");

    res.status(201).json({
      ...comment.toObject(),
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getArticleComments = async (req, res) => {
  try {
    const { articleId } = req.params;

    const comments = await Comment.aggregate([
      { $match: { articleId } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          id: 1,
          articleId: 1,
          userId: 1,
          content: 1,
          likes: 1,
          createdAt: 1,
          user: {
            id: "$user.id",
            name: "$user.name",
            username: "$user.username",
            avatar: "$user.avatar",
          },
        },
      },
    ]);

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findOneAndDelete({
      id,
      userId: req.userId,
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found or unauthorized" });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
