import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import mongoose from 'mongoose';
import { deleteBlogPost } from './blogController'; // Adjust the import path as needed
import { Blog } from '../../models/blog/blog'; // Adjust the import path as needed
import { AuthenticatedRequest } from '../../middleware/authMiddleware'; // Adjust the import path as needed

// Extend the AuthenticatedRequest type
type TestAuthenticatedRequest = AuthenticatedRequest & {
  params: { id: string };
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
    findByIdAndDelete: vi.fn(),
  },
}));

describe('deleteBlogPost', () => {
  let req: TestAuthenticatedRequest;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      user: { id: 'user-id', role: 'editor' },
      params: { id: 'valid-id' },
    } as TestAuthenticatedRequest;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as Partial<Response>;

    // Reset mock function calls
    vi.clearAllMocks();
  });

  it('should delete a blog post when user is authorized and blog exists', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findByIdAndDelete).mockResolvedValue({ _id: 'valid-id', title: 'Test Blog' });

    await deleteBlogPost(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('valid-id');
    expect(Blog.findByIdAndDelete).toHaveBeenCalledWith('valid-id');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Blog post deleted successfully' });
  });

  it('should return 403 when user is not authenticated', async () => {
    req.user = undefined;

    await deleteBlogPost(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return 403 when user is not an editor', async () => {
    req.user = { id: 'user-id', role: 'user' };

    await deleteBlogPost(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return 400 when blog ID is invalid', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(false);

    await deleteBlogPost(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('valid-id');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid blog ID' });
  });

  it('should return 404 when blog post is not found', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findByIdAndDelete).mockResolvedValue(null);

    await deleteBlogPost(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('valid-id');
    expect(Blog.findByIdAndDelete).toHaveBeenCalledWith('valid-id');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Blog not found' });
  });

  it('should handle errors and return 500', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findByIdAndDelete).mockRejectedValue(new Error('Database error'));

    await deleteBlogPost(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('valid-id');
    expect(Blog.findByIdAndDelete).toHaveBeenCalledWith('valid-id');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});