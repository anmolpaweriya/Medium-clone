const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const articleSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: uuidv4,
            unique: true,
            immutable: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            unique: true,
            required: true,
            index: true,
        },

        excerpt: {
            type: String,
            default: "",
            maxlength: 300,
        },

        content: {
            type: String,
            required: true,
        },

        coverImage: {
            type: String,
            default: "",
        },

        tags: [{
            type: String,
            trim: true,
            lowercase: true,
        }],

        author: {
            type: String,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },

        readTime: {
            type: Number,
            default: 1,
        },

        publishedAt: Date,

        views: {
            type: Number,
            default: 0,
        },

        likes: [
            {
                type: String,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Article", articleSchema);
