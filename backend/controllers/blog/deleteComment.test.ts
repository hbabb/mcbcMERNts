import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import mongoose from 'mongoose';
import { deleteComment } from './blogController'; // Adjust the import path as needed
import { Blog, IComment } from '../../models/blog/blog'; // Adjust the import path as needed
import { AuthenticatedRequest } from '../../middleware/authMiddleware'; // Adjust the import path as needed

// Extend the AuthenticatedRequest type
type TestAuthenticatedRequest = AuthenticatedRequest & {
  params: { blogId: string; commentId: string };
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

describe('deleteComment', () => {
  let req: TestAuthenticatedRequest;
  let res: Partial<Response>;
  const mockBlogId = 'valid-blog-id';
  const mockCommentId = 'valid-comment-id';
  const mockUserId = 'user-id';

  beforeEach(() => {
    req = {
      user: { id: mockUserId, role: 'user' },
      params: { blogId: mockBlogId, commentId: mockCommentId },
    } as TestAuthenticatedRequest;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as Partial<Response>;

    // Reset mock function calls
    vi.clearAllMocks();
  });

  it('should delete a comment when user has permission', async () => {
    const mockComment: IComment = {
      _id: new mongoose.Types.ObjectId(mockCommentId),
      commenter: new mongoose.Types.ObjectId(mockUserId),
      comment: 'Test comment',
    };
    const mockBlog = {
      _id: mockBlogId,
      comments: [mockComment],
      save: vi.fn().mockResolvedValue(true),
    };
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findById).mockResolvedValue(mockBlog);

    await deleteComment(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(mockBlogId);
    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(mockCommentId);
    expect(Blog.findById).toHaveBeenCalledWith(mockBlogId);
    expect(mockBlog.comments).toHaveLength(0);
    expect(mockBlog.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Comment deleted successfully' });
  });

  it('should allow admin to delete any comment', async () => {
    req.user.role = 'admin';
    req.user.id = 'admin-id';
    const mockComment: IComment = {
      _id: new mongoose.Types.ObjectId(mockCommentId),
      commenter: new mongoose.Types.ObjectId('other-user-id'),
      comment: 'Test comment',
    };
    const mockBlog = {
      _id: mockBlogId,
      comments: [mockComment],
      save: vi.fn().mockResolvedValue(true),
    };
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findById).mockResolvedValue(mockBlog);

    await deleteComment(req, res as Response);

    expect(mockBlog.comments).toHaveLength(0);
    expect(mockBlog.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Comment deleted successfully' });
  });

  it('should return 400 when blog ID or comment ID is invalid', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(false);

    await deleteComment(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid blog ID or comment ID' });
  });

  it('should return 404 when blog is not found', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findById).mockResolvedValue(null);

    await deleteComment(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Blog not found' });
  });

  it('should return 404 when comment is not found', async () => {
    const mockBlog = {
      _id: mockBlogId,
      comments: [],
    };
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findById).mockResolvedValue(mockBlog);

    await deleteComment(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Comment not found' });
  });

  it('should return 403 when user does not have permission to delete comment', async () => {
    const mockComment: IComment = {
      _id: new mongoose.Types.ObjectId(mockCommentId),
      commenter: new mongoose.Types.ObjectId('other-user-id'),
      comment: 'Test comment',
    };
    const mockBlog = {
      _id: mockBlogId,
      comments: [mockComment],
    };
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findById).mockResolvedValue(mockBlog);

    await deleteComment(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'You can only delete your own comments or you must be an admin' });
  });

  it('should handle errors and return 500', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findById).mockRejectedValue(new Error('Database error'));

    await deleteComment(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});