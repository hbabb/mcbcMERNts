import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import mongoose from 'mongoose';
import { updateComment } from './blogController'; // Adjust the import path as needed
import { Blog, IComment } from '../../models/blog/blog'; // Adjust the import path as needed
import { AuthenticatedRequest } from '../../middleware/authMiddleware'; // Adjust the import path as needed
import { sanitizeInput } from '../../utils/inputValidation'; // Adjust the import path as needed

// Extend the AuthenticatedRequest type
type TestAuthenticatedRequest = AuthenticatedRequest & {
  params: { blogId: string; commentId: string };
  body: { comment: string };
  user: { id: string; role: string };
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

describe('updateComment', () => {
  let req: TestAuthenticatedRequest;
  let res: Partial<Response>;
  const mockBlogId = 'valid-blog-id';
  const mockCommentId = 'valid-comment-id';
  const mockUserId = 'user-id';
  const mockComment = 'This is an updated comment';

  beforeEach(() => {
    req = {
      user: { id: mockUserId, role: 'user' },
      params: { blogId: mockBlogId, commentId: mockCommentId },
      body: { comment: mockComment },
    } as TestAuthenticatedRequest;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as Partial<Response>;

    // Reset mock function calls
    vi.clearAllMocks();
  });

  it('should update a comment when input is valid and user has permission', async () => {
    const mockComment: IComment = {
      _id: new mongoose.Types.ObjectId(mockCommentId),
      commenter: new mongoose.Types.ObjectId(mockUserId),
      comment: 'Original comment',
      editedByAdmin: false,
    };
    const mockBlog = {
      _id: mockBlogId,
      comments: [mockComment],
      save: vi.fn().mockResolvedValue(true),
    };
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findById).mockResolvedValue(mockBlog);

    await updateComment(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(mockBlogId);
    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(mockCommentId);
    expect(Blog.findById).toHaveBeenCalledWith(mockBlogId);
    expect(sanitizeInput).toHaveBeenCalledWith(mockComment);
    expect(mockBlog.comments[0].comment).toBe(mockComment);
    expect(mockBlog.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Comment updated successfully',
      comment: expect.objectContaining({ comment: mockComment }),
    }));
  });

  it('should allow admin to update any comment and set editedByAdmin flag', async () => {
    req.user.role = 'admin';
    req.user.id = 'admin-id';
    const mockComment: IComment = {
      _id: new mongoose.Types.ObjectId(mockCommentId),
      commenter: new mongoose.Types.ObjectId(mockUserId),
      comment: 'Original comment',
      editedByAdmin: false,
    };
    const mockBlog = {
      _id: mockBlogId,
      comments: [mockComment],
      save: vi.fn().mockResolvedValue(true),
    };
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findById).mockResolvedValue(mockBlog);

    await updateComment(req, res as Response);

    expect(mockBlog.comments[0].comment).toBe(mockComment);
    expect(mockBlog.comments[0].editedByAdmin).toBe(true);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ... (other test cases remain the same)

});