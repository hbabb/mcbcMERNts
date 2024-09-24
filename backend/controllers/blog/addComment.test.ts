import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import mongoose from 'mongoose';
import { addComment } from './blogController'; // Adjust the import path as needed
import { Blog } from '../../models/blog/blog'; // Adjust the import path as needed
import { AuthenticatedRequest } from '../../middleware/authMiddleware'; // Adjust the import path as needed
import { sanitizeInput } from '../../utils/inputValidation'; // Adjust the import path as needed

// Extend the AuthenticatedRequest type
type TestAuthenticatedRequest = AuthenticatedRequest & {
  params: { id: string };
  body: { comment: string };
};

// Mock mongoose
vi.mock('mongoose', () => ({
  Types: {
    ObjectId: {
      isValid: vi.fn(),
    },
  },
}));

// Mock the Blog model
vi.mock('./models/Blog', () => ({
  Blog: {
    findById: vi.fn(),
  },
}));

// Mock the sanitizeInput function
vi.mock('./utils/sanitize', () => ({
  sanitizeInput: vi.fn(input => input),
}));

describe('addComment', () => {
  let req: TestAuthenticatedRequest;
  let res: Partial<Response>;
  const mockBlogId = 'valid-blog-id';
  const mockUserId = 'user-id';
  const mockComment = 'This is a test comment';

  beforeEach(() => {
    req = {
      user: { id: mockUserId },
      params: { id: mockBlogId },
      body: { comment: mockComment },
    } as TestAuthenticatedRequest;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as Partial<Response>;

    // Reset mock function calls
    vi.clearAllMocks();
  });

  it('should add a comment when input is valid and blog exists', async () => {
    const mockBlog = {
      _id: mockBlogId,
      comments: [],
      save: vi.fn().mockResolvedValue(true),
    };
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findById).mockResolvedValue(mockBlog);

    await addComment(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(mockBlogId);
    expect(Blog.findById).toHaveBeenCalledWith(mockBlogId);
    expect(sanitizeInput).toHaveBeenCalledWith(mockComment);
    expect(mockBlog.comments).toHaveLength(1);
    expect(mockBlog.comments[0]).toEqual(expect.objectContaining({
      commenter: mockUserId,
      comment: mockComment,
    }));
    expect(mockBlog.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Comment added successfully',
      blog: mockBlog,
    }));
  });

  it('should return 400 when blog ID is invalid', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(false);

    await addComment(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(mockBlogId);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid blog ID' });
  });

  it('should return 400 when comment is empty', async () => {
    req.body.comment = '';

    await addComment(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Comment cannot be empty' });
  });

  it('should return 404 when blog is not found', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findById).mockResolvedValue(null);

    await addComment(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(mockBlogId);
    expect(Blog.findById).toHaveBeenCalledWith(mockBlogId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Blog not found' });
  });

  it('should handle errors and return 500', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findById).mockRejectedValue(new Error('Database error'));

    await addComment(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(mockBlogId);
    expect(Blog.findById).toHaveBeenCalledWith(mockBlogId);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});