const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const notificationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      immutable: true,
    },

    recipient: {
      type: String,
      ref: "User",
      required: true,
    },

    actor: {
      type: String,
      ref: "User",
      required: true,
    },

    kind: {
      type: String,
      enum: ["clap", "follow", "comment", "publish", "mention"],
      required: true,
    },

    articleId: {
      type: String,
      ref: "Article",
      default: null,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
