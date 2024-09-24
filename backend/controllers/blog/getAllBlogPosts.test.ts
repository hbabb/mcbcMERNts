import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { getAllBlogPosts } from './blogController'; // Adjust the import path as needed
import { Blog } from '../../models/blog/blog'; // Adjust the import path as needed

// Mock the Blog model
vi.mock('./models/Blog', () => ({
  Blog: {
    find: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

describe('getAllBlogPosts', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Reset mock function calls
    vi.clearAllMocks();
  });

  it('should return blog posts with pagination info', async () => {
    // Mock data
    const mockBlogPosts = [
      { id: '1', title: 'Post 1' },
      { id: '2', title: 'Post 2' },
    ];
    const mockTotal = 20;

    // Mock Blog.find() chain
    const mockFind = vi.fn().mockReturnThis();
    const mockSkip = vi.fn().mockReturnThis();
    const mockLimit = vi.fn().mockReturnThis();
    const mockSort = vi.fn().mockResolvedValue(mockBlogPosts);

    (Blog.find as any).mockReturnValue({
      skip: mockSkip,
      limit: mockLimit,
      sort: mockSort,
    });

    // Mock Blog.countDocuments()
    (Blog.countDocuments as any).mockResolvedValue(mockTotal);

    // Call the function
    await getAllBlogPosts(req as Request, res as Response);

    // Assertions
    expect(Blog.find).toHaveBeenCalled();
    expect(mockSkip).toHaveBeenCalledWith(0);
    expect(mockLimit).toHaveBeenCalledWith(10);
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(Blog.countDocuments).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      blogPosts: mockBlogPosts,
      currentPage: 1,
      totalPages: 2,
      totalPosts: mockTotal,
    });
  });

  it('should handle custom page and limit', async () => {
    req.query = { page: '2', limit: '5' };

    // Mock data and functions as before
    const mockBlogPosts = [{ id: '6', title: 'Post 6' }];
    const mockTotal = 8;

    const mockFind = vi.fn().mockReturnThis();
    const mockSkip = vi.fn().mockReturnThis();
    const mockLimit = vi.fn().mockReturnThis();
    const mockSort = vi.fn().mockResolvedValue(mockBlogPosts);

    (Blog.find as any).mockReturnValue({
      skip: mockSkip,
      limit: mockLimit,
      sort: mockSort,
    });

    (Blog.countDocuments as any).mockResolvedValue(mockTotal);

    // Call the function
    await getAllBlogPosts(req as Request, res as Response);

    // Assertions
    expect(mockSkip).toHaveBeenCalledWith(5);
    expect(mockLimit).toHaveBeenCalledWith(5);
    expect(res.json).toHaveBeenCalledWith({
      blogPosts: mockBlogPosts,
      currentPage: 2,
      totalPages: 2,
      totalPosts: mockTotal,
    });
  });

  it('should handle errors', async () => {
    const errorMessage = 'Database error';
    (Blog.find as any).mockRejectedValue(new Error(errorMessage));

    // Call the function
    await getAllBlogPosts(req as Request, res as Response);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});