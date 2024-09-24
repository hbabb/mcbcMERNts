import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { getBlogById } from './blogController'; // Adjust the import path as needed
import { Blog } from '../../models/blog/blog'; // Adjust the import path as needed

// Mock the mongoose and Blog model
vi.mock('mongoose', () => ({
  Types: {
    ObjectId: {
      isValid: vi.fn(),
    },
  },
}));

vi.mock('./models/Blog', () => ({
  Blog: {
    findById: vi.fn(),
  },
}));

describe('getBlogById', () => {
  let req: Partial<Request> & { params: { id: string } };
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: { id: 'valid-id' },
    } as Partial<Request> & { params: { id: string } };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as Partial<Response>;

    // Reset mock function calls
    vi.clearAllMocks();
  });

  it('should return a blog post when it exists', async () => {
    const mockBlog = { _id: 'valid-id', title: 'Test Blog Post' };
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findById).mockResolvedValue(mockBlog);

    await getBlogById(req as Request, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('valid-id');
    expect(Blog.findById).toHaveBeenCalledWith('valid-id');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockBlog);
  });

  it('should return 400 when blog ID is invalid', async () => {
    req.params.id = 'invalid-id';
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(false);

    await getBlogById(req as Request, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('invalid-id');
    expect(Blog.findById).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid blog ID' });
  });

  it('should return 404 when blog post does not exist', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findById).mockResolvedValue(null);

    await getBlogById(req as Request, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('valid-id');
    expect(Blog.findById).toHaveBeenCalledWith('valid-id');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Blog not found' });
  });

  it('should handle errors and return 500', async () => {
    const errorMessage = 'Database error';
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(Blog.findById).mockRejectedValue(new Error(errorMessage));

    await getBlogById(req as Request, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('valid-id');
    expect(Blog.findById).toHaveBeenCalledWith('valid-id');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});