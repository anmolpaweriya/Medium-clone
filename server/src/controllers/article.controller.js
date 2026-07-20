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
          $project: {
              _id: 0,

              id: 1,
              slug: 1,
              title: 1,
              excerpt: 1,
              content: 1,        // <-- add this
              coverImage: 1,
              tags: 1,
              readTime: 1,
              status: 1,
              publishedAt: 1,
              createdAt: 1,
              likes: 1,
              comments: 1,
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



exports.getFeed = async (req, res) => {

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
            slug: req.params.slug,
        });

        if (!article.length) {

            return res.status(404).json({
                message: "Article not found",
            });

        }

        await Article.updateOne(
            {
                slug: req.params.slug,
            },
            {
                $inc: {
                    views: 1,
                }
            }
        );

        res.json(article[0]);

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};

exports.updateArticle = async (req, res) => {

    try {

        const article = await Article.findOne({
            id: req.params.id,
            author: req.userId,
        });

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

        const latest = articles.slice(4);

        const writersMap = new Map();

        const tagsMap = new Map();

        for (const article of articles) {

            if (!writersMap.has(article.author.id)) {
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
