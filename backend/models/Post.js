const mongoose = require('mongoose');

// ============================================
// REPLY SCHEMA (leaf-level, no further nesting)
// ============================================
const replySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentComment: {
      // which comment this reply belongs to
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
    },
    parentPost: {
      // which post this reply ultimately belongs to (for user activity lookup)
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // ── Soft delete ──────────────────────────────
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      // who triggered the delete — the author or an admin
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // ── Edit tracking ────────────────────────────
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ============================================
// COMMENT SCHEMA
// ============================================
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Replies are stored as separate Reply documents,
    // we only keep references here for easy population
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply',
      },
    ],

    // ── Soft delete ──────────────────────────────
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // ── Edit tracking ────────────────────────────
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ============================================
// POST SCHEMA
// ============================================
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40000,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Comment references — replies are NOT stored here,
    // they live inside each Comment document
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],

    // ── Soft delete ──────────────────────────────
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // ── Edit tracking ────────────────────────────
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ============================================
// INDEXES for faster queries
// ============================================

// Feed: newest non-deleted posts first
postSchema.index({ isDeleted: 1, createdAt: -1 });

// Top posts (sorted by upvote count) — we sort in-app but this helps filter
postSchema.index({ isDeleted: 1, 'upvotes': 1 });

// User activity page: all posts by a user
postSchema.index({ author: 1, isDeleted: 1, createdAt: -1 });

// User activity: all comments by a user
commentSchema.index({ author: 1, isDeleted: 1, createdAt: -1 });

// Replies by a user
replySchema.index({ author: 1, isDeleted: 1, createdAt: -1 });

// Fetch all comments for a post
commentSchema.index({ parentPost: 1, isDeleted: 1 });

// Fetch all replies for a comment
replySchema.index({ parentComment: 1, isDeleted: 1 });

const Post    = mongoose.model('Post',    postSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Reply   = mongoose.model('Reply',   replySchema);


module.exports = { Post, Comment, Reply };