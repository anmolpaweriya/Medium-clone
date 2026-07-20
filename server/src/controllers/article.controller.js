const Article = require("../models/Article");
const User = require("../models/User");

const slugify = require("../utils/slug");
const calculateReadTime = require("../utils/calculateReadTime");

exports.createArticle = async (req, res) => {
    try {

        const {
            title,
            excerpt,
            content,
            coverImage,
            tags,
            status,
        } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required",
            });
        }

        let slug = slugify(title);

        let count = 1;

        while (await Article.exists({ slug })) {
            slug = `${slugify(title)}-${count++}`;
        }

        const article = await Article.create({

            title,

            slug,

            excerpt,

            content,

            coverImage,

            tags,

            author: req.userId,

            status,

            readTime: calculateReadTime(content),

            publishedAt:
                status === "published"
                    ? new Date()
                    : null,
        });

        res.status(201).json(article);

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }
};



const Notification = require("../models/Notification");

async function populateArticles(filter = {}) {

    return await Article.aggregate([

        {
            $match: filter
        },

        {
            $sort: {
                publishedAt: -1,
                createdAt: -1,
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "id",
                as: "author",
            }
        },

        {
            $unwind: "$author"
        },

        {
            $lookup: {
                from: "comments",
                localField: "id",
                foreignField: "articleId",
                as: "commentsList",
            }
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
              likesList: { $ifNull: ["$likes", []] },
              likes: { $size: { $ifNull: ["$likes", []] } },
              comments: { $size: "$commentsList" },
              views: 1,

              author: {
                  id: "$author.id",
                  name: "$author.name",
                  username: "$author.username",
                  avatar: "$author.avatar",
                  bio: "$author.bio",
              }
          }
        }

    ]);

}

exports.toggleLike = async (req, res) => {
    try {
        const article = await Article.findOne({ id: req.params.id });

        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        if (!article.likes) {
            article.likes = [];
        }

        const index = article.likes.indexOf(req.userId);
        let liked = false;

        if (index > -1) {
            article.likes.splice(index, 1);
        } else {
            article.likes.push(req.userId);
            liked = true;

            if (article.author && article.author !== req.userId) {
                await Notification.create({
                    recipient: article.author,
                    actor: req.userId,
                    kind: "clap",
                    articleId: article.id,
                });
            }
        }

        await article.save();

        res.json({
            liked,
            likes: article.likes.length,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.getTrendingFeed = async (req, res) => {
    try {
        const articles = await populateArticles({ status: "published" });

        articles.sort((a, b) => (b.likes + (b.views || 0)) - (a.likes + (a.views || 0)));

        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getFeed = async (req, res) => {
    try {
        const filter = { status: "published" };

        if (req.query.tags) {
            const tagsList = req.query.tags.split(",");
            filter.tags = { $in: tagsList };
        }

        if (req.query.exclude) {
            filter.slug = { $ne: req.query.exclude };
        }

        const articles = await populateArticles(filter);
        res.json(articles);

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};



exports.getFollowingFeed = async (req, res) => {

    try {

        const articles = await populateArticles({
            status: "published",
        });

        res.json(articles);

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};

exports.getTopicsFeed = async (req, res) => {

    try {

        const articles = await populateArticles({
            status: "published",
        });

        res.json(articles);

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};


exports.getMyArticles = async (req, res) => {

    try {

        const articles = await populateArticles({
            author: req.userId,
        });

        res.json(articles);

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};

exports.getArticle = async (req, res) => {
    try {
        const article = await populateArticles({
            $or: [{ slug: req.params.slug }, { id: req.params.slug }],
        });

        if (!article.length) {
            return res.status(404).json({
                message: "Article not found",
            });
        }

        if (article[0].status === "published") {
            await Article.updateOne(
                { id: article[0].id },
                {
                    $inc: {
                        views: 1,
                    }
                }
            );
        }

        res.json(article[0]);

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};

exports.updateArticle = async (req, res) => {

    try {
        const user = await User.findOne({ id: req.userId });
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const filter = {
            $or: [{ id: req.params.id }, { slug: req.params.id }],
        };

        if (user.role !== "admin") {
            filter.author = req.userId;
        }

        const article = await Article.findOne(filter);

        if (!article) {

            return res.status(404).json({
                message: "Article not found",
            });

        }

        const {
            title,
            excerpt,
            content,
            coverImage,
            tags,
            status,
        } = req.body;

        if (title && title !== article.title) {

            article.title = title;
            article.slug = slugify(title);

        }

        if (excerpt !== undefined)
            article.excerpt = excerpt;

        if (content !== undefined) {

            article.content = content;
            article.readTime = calculateReadTime(content);

        }

        if (coverImage !== undefined)
            article.coverImage = coverImage;

        if (tags !== undefined)
            article.tags = tags;

        if (status !== undefined) {

            article.status = status;

            if (
                status === "published" &&
                !article.publishedAt
            ) {
                article.publishedAt = new Date();
            }

        }

        await article.save();

        res.json(article);

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};

exports.deleteArticle = async (req, res) => {

    try {

        const article = await Article.findOneAndDelete({

            id: req.params.id,

            author: req.userId,

        });

        if (!article) {

            return res.status(404).json({
                message: "Article not found",
            });

        }

        res.json({
            message: "Article deleted",
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};


exports.getHome = async (req, res) => {
    try {

        const articles = await populateArticles({
            status: "published",
        });

        const hero = articles[0] || null;
        const featured = articles.slice(1, 4);
        const latest = articles.length > 4 ? articles.slice(4) : articles;

        const writersMap = new Map();
        const tagsMap = new Map();

        for (const article of articles) {
            if (article.author && article.author.id && !writersMap.has(article.author.id)) {
                writersMap.set(article.author.id, article.author);
            }

            for (const tag of article.tags || []) {
                tagsMap.set(tag, true);
            }
        }

        res.json({
            hero,
            featured,
            latest,
            writers: [...writersMap.values()].slice(0, 6),
            trendingTags: [...tagsMap.keys()].slice(0, 10),
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }
};
