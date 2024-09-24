import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { getBlogBySlug } from './blogController'; // Adjust the import path as needed
import { Blog } from '../../models/blog/blog'; // Adjust the import path as needed
import * as sanitizeModule from '../../utils/inputValidation'; // Adjust the import path as needed

// Mock the Blog model and sanitizeInput function
vi.mock('./models/Blog', () => ({
  Blog: {
    findOne: vi.fn(),
  },
}));

vi.mock('./utils/sanitize', () => ({
  sanitizeInput: vi.fn((input: string) => input), // Mock implementation that returns the input
}));

describe('getBlogBySlug', () => {
  let req: Partial<Request> & { params: { slug: string } };
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: { slug: 'test-blog-post' },
    } as Partial<Request> & { params: { slug: string } };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as Partial<Response>;

    // Reset mock function calls
    vi.clearAllMocks();
  });

  it('should return a blog post when it exists', async () => {
    const mockBlog = { slug: 'test-blog-post', title: 'Test Blog Post' };
    vi.mocked(Blog.findOne).mockResolvedValue(mockBlog);

    await getBlogBySlug(req as Request, res as Response);

    expect(sanitizeModule.sanitizeInput).toHaveBeenCalledWith('test-blog-post');
    expect(Blog.findOne).toHaveBeenCalledWith({ slug: 'test-blog-post' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockBlog);
  });

  it('should return 404 when blog post does not exist', async () => {
    vi.mocked(Blog.findOne).mockResolvedValue(null);

    await getBlogBySlug(req as Request, res as Response);

    expect(sanitizeModule.sanitizeInput).toHaveBeenCalledWith('test-blog-post');
    expect(Blog.findOne).toHaveBeenCalledWith({ slug: 'test-blog-post' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Blog not found' });
  });

  it('should handle errors and return 500', async () => {
    const errorMessage = 'Database error';
    vi.mocked(Blog.findOne).mockRejectedValue(new Error(errorMessage));

    await getBlogBySlug(req as Request, res as Response);

    expect(sanitizeModule.sanitizeInput).toHaveBeenCalledWith('test-blog-post');
    expect(Blog.findOne).toHaveBeenCalledWith({ slug: 'test-blog-post' });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

  it('should sanitize the slug input', async () => {
    const unsanitizedSlug = '<script>alert("xss")</script>';
    req.params.slug = unsanitizedSlug;
    const sanitizedSlug = 'sanitized-slug';
    vi.mocked(sanitizeModule.sanitizeInput).mockReturnValue(sanitizedSlug);

    await getBlogBySlug(req as Request, res as Response);

    expect(sanitizeModule.sanitizeInput).toHaveBeenCalledWith(unsanitizedSlug);
    expect(Blog.findOne).toHaveBeenCalledWith({ slug: sanitizedSlug });
  });
});