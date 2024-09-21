// mcbcMERNts/backend/models/blog/Blog.ts

import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IComment {
  _id: mongoose.Types.ObjectId;
  commenter: mongoose.Types.ObjectId;
  comment: string;
  editedByAdmin?: boolean;
}

export interface IBlog extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  comments: IComment[];
  // Add other fields as necessary
}

const CommentSchema = new Schema({
  commenter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  editedByAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

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
const BlogSchema = new mongoose.Schema(
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
    comments: [CommentSchema],
    images: [mediaSchema],
    videos: [mediaSchema],
  },
  {
    timestamps: true,
  },
);

const Blog = mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
