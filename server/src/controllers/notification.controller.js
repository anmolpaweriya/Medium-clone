const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.aggregate([
      { $match: { recipient: req.userId } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "actor",
          foreignField: "id",
          as: "actor",
        },
      },
      { $unwind: "$actor" },
      {
        $lookup: {
          from: "articles",
          localField: "articleId",
          foreignField: "id",
          as: "article",
        },
      },
      {
        $unwind: {
          path: "$article",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          kind: 1,
          read: 1,
          createdAt: 1,
          actor: {
            id: "$actor.id",
            name: "$actor.name",
            username: "$actor.username",
            avatar: "$actor.avatar",
          },
          article: {
            id: "$article.id",
            title: "$article.title",
            slug: "$article.slug",
          },
        },
      },
    ]);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.userId, read: false },
      { $set: { read: true } }
    );

    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
