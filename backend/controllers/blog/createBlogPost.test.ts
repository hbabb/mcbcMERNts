import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import { createBlogPost } from './blogController'; // Adjust the import path as needed
import { Blog, IBlog } from '../../models/blog/blog'; // Adjust the import path as needed
import { validateBlogInput } from '../../utils/inputValidation'; // Adjust the import path as needed
import { AuthenticatedRequest } from '../../middleware/authMiddleware'; // Adjust the import path as needed
import { ValidationError, ValidationResult } from 'joi';

// Extend the AuthenticatedRequest type
type TestAuthenticatedRequest = AuthenticatedRequest & {
  body: any;
};

// Define mockBlogData
const mockBlogData = {
  title: 'Test Blog',
  summary: 'Test Summary',
  content: 'Test Content',
  tags: ['test', 'blog'],
};

// Mock the Blog model
vi.mock('./models/Blog', () => ({
  Blog: vi.fn().mockImplementation(() => ({
    save: vi.fn().mockResolvedValue({ _id: 'new-blog-id', ...mockBlogData }),
  })),
}));

// Mock the validateBlogInput function
vi.mock('./utils/inputValidation', () => ({
  validateBlogInput: vi.fn(),
}));

describe('createBlogPost', () => {
  let req: TestAuthenticatedRequest;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      user: { id: 'user-id', role: 'editor' },
      body: mockBlogData,
    } as TestAuthenticatedRequest;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as Partial<Response>;

    // Reset mock function calls
    vi.clearAllMocks();
  });

  it('should create a blog post when input is valid and user is authorized', async () => {
    vi.mocked(validateBlogInput).mockReturnValue({ error: undefined, value: mockBlogData } as ValidationResult<any>);

    await createBlogPost(req, res as Response);

    expect(validateBlogInput).toHaveBeenCalledWith(mockBlogData);
    expect(Blog).toHaveBeenCalledWith({
      ...mockBlogData,
      author: 'user-id',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: 'new-blog-id', ...mockBlogData }));
  });

  it('should return 403 when user is not authenticated', async () => {
    req.user = undefined;

    await createBlogPost(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return 403 when user is not an editor', async () => {
    req.user = { id: 'user-id', role: 'user' };

    await createBlogPost(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return 400 when input validation fails', async () => {
    const validationError: ValidationError = {
      details: [{ message: 'Invalid input' }],
    } as ValidationError;
    vi.mocked(validateBlogInput).mockReturnValue({ error: validationError, value: mockBlogData } as ValidationResult<any>);

    await createBlogPost(req, res as Response);

    expect(validateBlogInput).toHaveBeenCalledWith(mockBlogData);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input' });
  });

  it('should handle errors and return 500', async () => {
    vi.mocked(validateBlogInput).mockReturnValue({ error: undefined, value: mockBlogData } as ValidationResult<any>);
    vi.mocked(Blog).mockImplementationOnce(() => ({
      save: vi.fn().mockRejectedValue(new Error('Database error')),
    } as unknown as IBlog));

    await createBlogPost(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});