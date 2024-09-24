import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import mongoose from 'mongoose';
import { updateBlogPost } from './blogController'; // Adjust the import path as needed
import { Blog, IBlog } from '../../models/blog/blog'; // Adjust the import path as needed
import { validateBlogInput } from '../../utils/inputValidation'; // Adjust the import path as needed
import { AuthenticatedRequest } from '../../middleware/authMiddleware'; // Adjust the import path as needed
import { ValidationError, ValidationResult } from 'joi';

// Extend the AuthenticatedRequest type
type TestAuthenticatedRequest = AuthenticatedRequest & {
  body: any;
  params: { id: string };
};

// Define mockBlogData
const mockBlogData = {
  title: 'Updated Test Blog',
  summary: 'Updated Test Summary',
  content: 'Updated Test Content',
  tags: ['test', 'blog', 'update'],
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
    findByIdAndUpdate: vi.fn(),
  },
}));

// Mock the validateBlogInput function
vi.mock('./utils/inputValidation', () => ({
  validateBlogInput: vi.fn(),
}));

describe('updateBlogPost', () => {
  let req: TestAuthenticatedRequest;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      user: { id: 'user-id', role: 'editor' },
      body: mockBlogData,
      params: { id: 'valid-id' },
    } as TestAuthenticatedRequest;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as Partial<Response>;

    // Reset mock function calls
    vi.clearAllMocks();
  });

  it('should update a blog post when input is valid and user is authorized', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(validateBlogInput).mockReturnValue({ error: undefined, value: mockBlogData } as ValidationResult<any>);
    vi.mocked(Blog.findByIdAndUpdate).mockResolvedValue({ ...mockBlogData, _id: 'valid-id' });

    await updateBlogPost(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('valid-id');
    expect(validateBlogInput).toHaveBeenCalledWith(mockBlogData);
    expect(Blog.findByIdAndUpdate).toHaveBeenCalledWith('valid-id', mockBlogData, { new: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ...mockBlogData, _id: 'valid-id' }));
  });

  it('should return 403 when user is not authenticated', async () => {
    req.user = undefined;

    await updateBlogPost(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return 403 when user is not an editor', async () => {
    req.user = { id: 'user-id', role: 'user' };

    await updateBlogPost(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return 400 when blog ID is invalid', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(false);

    await updateBlogPost(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('valid-id');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid blog ID' });
  });

  it('should return 400 when input validation fails', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    const validationError: ValidationError = {
      details: [{ message: 'Invalid input' }],
    } as ValidationError;
    vi.mocked(validateBlogInput).mockReturnValue({ error: validationError, value: mockBlogData } as ValidationResult<any>);

    await updateBlogPost(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('valid-id');
    expect(validateBlogInput).toHaveBeenCalledWith(mockBlogData);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input' });
  });

  it('should return 404 when blog post is not found', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(validateBlogInput).mockReturnValue({ error: undefined, value: mockBlogData } as ValidationResult<any>);
    vi.mocked(Blog.findByIdAndUpdate).mockResolvedValue(null);

    await updateBlogPost(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('valid-id');
    expect(validateBlogInput).toHaveBeenCalledWith(mockBlogData);
    expect(Blog.findByIdAndUpdate).toHaveBeenCalledWith('valid-id', mockBlogData, { new: true });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Blog not found' });
  });

  it('should handle errors and return 500', async () => {
    vi.mocked(mongoose.Types.ObjectId.isValid).mockReturnValue(true);
    vi.mocked(validateBlogInput).mockReturnValue({ error: undefined, value: mockBlogData } as ValidationResult<any>);
    vi.mocked(Blog.findByIdAndUpdate).mockRejectedValue(new Error('Database error'));

    await updateBlogPost(req, res as Response);

    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('valid-id');
    expect(validateBlogInput).toHaveBeenCalledWith(mockBlogData);
    expect(Blog.findByIdAndUpdate).toHaveBeenCalledWith('valid-id', mockBlogData, { new: true });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});