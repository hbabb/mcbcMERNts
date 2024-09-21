// mcbcMERNts/backend/models/blog/Blog.ts

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define schema for comment data
const commentSchema = new mongoose.Schema(
  {
    commenter: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    _id: false,
  },
);

// Define schema for image and video data
const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    _id: false,
  },
);

// Define schema for blog data
const blogSchema = new mongoose.Schema(
  {
    blogId: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      minlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1000,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    comments: [commentSchema],
    images: [mediaSchema],
    videos: [mediaSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Blog', blogSchema);
