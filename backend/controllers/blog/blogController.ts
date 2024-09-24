// mcbcMERNts/backend/controllers/blog/blogController.ts

import mongoose from 'mongoose';
import { Blog } from '../../models/blog/blog';
import { Request, Response } from 'express';
import { validateBlogInput, sanitizeInput } from '../../utils/inputValidation';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

/**
 * Get all blog posts (with pagination)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getAllBlogPosts = async (req: Request, res: Response) => {
  try {
    // Get the page number and limit from the query string
    // If the page number or limit is not provided, use the default values
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Calculate the skip value
    // The skip value is the number of documents to skip in the database
    // before returning the documents
    // For example, if the page is 2 and the limit is 10, the skip value is 10
    // because we want to skip the first 10 documents and return the next 10
    const skip = (page - 1) * limit;

    // Log the page, limit and skip values
    console.log('Page: ', page);
    console.log('Limit: ', limit);
    console.log('Skip: ', skip);

    // Query the database and get the blog posts
    // Use the skip and limit methods to implement pagination
    // Sort the blog posts by createdAt in descending order (newest first)
    const blogPosts = await Blog.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get the total number of blog posts
    const total = await Blog.countDocuments();

    // Log the total number of blog posts
    console.log('Total: ', total);

    // Return the blog posts with pagination information
    // The pagination information includes the current page, total pages, and total posts
    res.status(200).json({
      blogPosts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    console.error('Error getting blog posts: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get blog post by ID
 *
 * This function takes a blog ID as a request parameter and fetches the corresponding
 * blog post from the database. It then returns the blog post as a JSON response.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('Get blog post by ID: ', id);

    // Check if the blog ID is valid
    // The blog ID must be a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid blog ID');
      // Return a 400 (Bad Request) response with an error message
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    // Fetch the blog post from the database
    // Use the findById() method to fetch the blog post with the given ID
    const blog = await Blog.findById(id);
    console.log('Blog: ', blog);

    // Check if the blog post was found
    // If the blog post was not found, return a 404 (Not Found) response
    if (!blog) {
      console.log('Blog not found');
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Return the blog post as a JSON response
    // Use the res.json() method to return the blog post
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog post by ID: ', error.message);
    // Return a 500 (Internal Server Error) response with an error message
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get a blog post by its slug.
 *
 * This function takes a slug as a request parameter and fetches the corresponding
 * blog post from the database. It then returns the blog post as a JSON response.
 *
 * The function first logs the slug to the console for debugging purposes.
 * It then fetches the blog post from the database using the findOne() method
 * and sanitizes the slug input to prevent any MongoDB injection attacks.
 * The sanitized slug is passed as a query object to the findOne() method.
 *
 * The function then checks if the blog post was found. If the blog post was not
 * found, it returns a 404 (Not Found) response with an error message.
 *
 * If the blog post was found, it returns the blog post as a JSON response using
 * the res.json() method.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    // Get the slug from the request parameters
    const { slug } = req.params;

    // Log the slug to the console for debugging purposes
    console.log(`Get blog post by slug: ${slug}`);

    // Fetch the blog post from the database
    // Use the findOne() method to fetch the blog post with the given slug
    // Sanitize the slug input to prevent any MongoDB injection attacks
    const sanitizedSlug = sanitizeInput(slug);
    console.log(`Sanitized slug: ${sanitizedSlug}`);
    const blog = await Blog.findOne({ slug: sanitizedSlug });
    console.log('Blog: ', blog);

    // Check if the blog post was found
    // If the blog post was not found, return a 404 (Not Found) response
    if (!blog) {
      console.log('Blog not found');
      // Return a 404 response with an error message
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Return the blog post as a JSON response
    // Use the res.json() method to return the blog post
    res.status(200).json(blog);
  } catch (error) {
    console.error(`Error fetching blog post by slug: ${error.message}`);
    // Return a 500 (Internal Server Error) response with an error message
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create a new blog post (editor only)
 *
 * This function takes a blog post as a JSON object in the request body
 * and creates a new blog post in the database. It checks if the request
 * is authenticated and if the user has the "editor" role. If the request
 * is invalid, it returns a 400 (Bad Request) response with an error message.
 * If the request is valid, it creates the blog post and returns a 201 (Created)
 * response with the new blog post.
 *
 * @param {AuthenticatedRequest} req - Express request object with
 * authenticated user information
 * @param {Response} res - Express response object
 */
export const createBlogPost = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    // Check if the request is authenticated and if the user has the "editor" role
    // If the user is not authenticated or does not have the "editor" role, return a 403 (Forbidden) response
    if (!req.user || req.user.role !== 'editor') {
      console.log('Unauthorized');
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Validate the blog post input
    // The validateBlogInput() function returns an object with an error property
    // if the input is invalid. If the input is invalid, return a 400 (Bad Request)
    // response with an error message.
    // The validateBlogInput() function is defined in the inputValidation utils file
    // and checks if the blog post title, summary, content, author, and tags are valid
    const { error } = validateBlogInput(req.body);
    if (error) {
      console.log('Validation error: ', error.details[0].message);
      // Return a 400 response with an error message
      return res.status(400).json({ message: error.details[0].message });
    }

    // Create the blog post
    // Create a new Blog object with the input from the request body and the
    // authenticated user's ID as the author.
    // The Blog object is defined in the blog model and has the following properties:
    // title, summary, content, author, tags, createdAt, and updatedAt
    const blog = new Blog({
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      author: req.user.id,
      tags: req.body.tags,
    });

    console.log('Creating blog post: ', blog);
    // Save the blog post to the database
    // Use the save() method to save the blog post to the database
    // The save() method returns a Promise that resolves to the saved blog post
    await blog.save();
    console.log('Blog post created: ', blog);
    // Return a 201 (Created) response with the new blog post
    // Use the res.json() method to return the blog post as a JSON object
    res.status(201).json(blog);
  } catch (error) {
    console.error('Error creating blog: ', error.message);
    // Return a 500 (Internal Server Error) response with an error message
    // Use the res.status() method to set the status code to 500
    // Use the res.json() method to return an error message as a JSON object
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update a blog post (editor only)
 *
 * This function takes a blog post ID as a request parameter and a blog post
 * object as the request body. It updates the blog post with the given ID
 * with the given blog post object.
 *
 * The function first checks if the request is authenticated and if the user
 * has the "editor" role. If the user is not authenticated or does not have the
 * "editor" role, it returns a 403 (Forbidden) response with an error message.
 *
 * The function then checks if the blog post ID is valid. If the blog post ID
 * is not valid, it returns a 400 (Bad Request) response with an error message.
 *
 * The function then validates the blog post object. If the blog post object
 * is invalid, it returns a 400 (Bad Request) response with an error message.
 *
 * The function then updates the blog post with the given ID with the given
 * blog post object. If the blog post with the given ID does not exist, it
 * returns a 404 (Not Found) response with an error message.
 *
 * If the blog post is updated successfully, it returns a 200 (OK) response
 * with the updated blog post object.
 *
 * @param {AuthenticatedRequest} req - Express request object with
 * authenticated user information
 * @param {Response} res - Express response object
 */
export const updateBlogPost = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    console.log(`Updating blog post with ID: ${req.params.id}`);
    // Check if the user is authenticated and has the "editor" role
    if (!req.user || req.user.role !== 'editor') {
      console.log('Unauthorized');
      // Return a 403 (Forbidden) response with an error message
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Get the blog post ID from the request parameters
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid blog ID');
      // Return a 400 (Bad Request) response with an error message
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    // Validate the blog post object
    const { error } = validateBlogInput(req.body);
    if (error) {
      console.log(`Validation error: ${error.details[0].message}`);
      // Return a 400 (Bad Request) response with an error message
      return res.status(400).json({ message: error.details[0].message });
    }

    // Update the blog post with the given ID with the given blog post object
    console.log('Updating blog post with: ', req.body);
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBlog) {
      console.log('Blog not found');
      // Return a 404 (Not Found) response with an error message
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Log the updated blog post
    console.log('Blog updated: ', updatedBlog);
    // Return a 200 (OK) response with the updated blog post object
    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error(`Error updating blog: ${error.message}`);
    // Return a 500 (Internal Server Error) response with an error message
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a blog post (editor only)
// This function deletes a blog post from the database with the given ID.
// It requires the user to be authenticated and have the "editor" role.
// If the user is not authenticated or does not have the "editor" role, it returns
// a 403 (Forbidden) response with an error message.
// If the blog ID is invalid, it returns a 400 (Bad Request) response with an error
// message.
// If the blog post is not found, it returns a 404 (Not Found) response with an error
// message.
// If the blog post is deleted successfully, it returns a 200 (OK) response with a
// success message.
export const deleteBlogPost = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  // This function is only accessible to authenticated users with the "editor"
  // role. If the user is not authenticated or does not have the "editor" role,
  // it returns a 403 (Forbidden) response with an error message.
  try {
    // Get the blog post ID from the request parameters
    const { id } = req.params;

    // Check if the user is authenticated and has the "editor" role
    if (!req.user || req.user.role !== 'editor') {
      console.log('Unauthorized');
      // Return a 403 (Forbidden) response with an error message
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if the blog ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid blog ID');
      // Return a 400 (Bad Request) response with an error message
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    // Delete the blog post from the database
    const deletedBlog = await Blog.findByIdAndDelete(id);
    // Check if the blog post was found
    if (!deletedBlog) {
      console.log('Blog not found');
      // Return a 404 (Not Found) response with an error message
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Log the deleted blog post
    console.log('Blog post deleted: ', deletedBlog);
    // Return a 200 (OK) response with a success message
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog: ', error.message);
    // Return a 500 (Internal Server Error) response with an error message
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Add a comment to a blog post
 *
 * This function takes a blog post ID as a request parameter and a comment
 * object as the request body. It adds the comment to the blog post with the
 * given ID.
 *
 * The function first checks if the request is authenticated and if the blog
 * post ID is valid. If the blog post ID is not valid, it returns a 400 (Bad
 * Request) response with an error message.
 *
 * The function then checks if the comment is empty. If the comment is empty,
 * it returns a 400 (Bad Request) response with an error message.
 *
 * The function then fetches the blog post from the database using the blog
 * post ID. If the blog post is not found, it returns a 404 (Not Found) response
 * with an error message.
 *
 * The function then adds the comment to the blog post and saves the blog post.
 * If the comment is added successfully, it returns a 200 (OK) response with a
 * success message.
 *
 * @param {AuthenticatedRequest} req - Express request object with
 * authenticated user information
 * @param {Response} res - Express response object
 */
export const addComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    // Log the blog post ID and the comment to the console
    console.log(`Adding comment to blog post: ${id}`);
    console.log('Comment: ', comment);

    // Check if the blog post ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // If the blog post ID is not valid, log an error message to the console
      console.log('Invalid blog ID');
      // Return a 400 (Bad Request) response with an error message
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    // Check if the comment is empty
    if (!comment || comment.trim().length === 0) {
      // If the comment is empty, log an error message to the console
      console.log('Comment cannot be empty');
      // Return a 400 (Bad Request) response with an error message
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    // Fetch the blog post from the database using the blog post ID
    const blog = await Blog.findById(id);
    if (!blog) {
      // If the blog post is not found, log an error message to the console
      console.log('Blog not found');
      // Return a 404 (Not Found) response with an error message
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Log the blog post to the console
    console.log('Adding comment to blog: ', blog);

    // Add the comment to the blog post
    blog.comments.push({
      _id: new mongoose.Types.ObjectId(),
      // The commenter is the authenticated user's ID
      commenter: req.user.id,
      // The comment is the sanitized comment
      comment: sanitizeInput(comment),
    });

    // Save the blog post
    await blog.save();

    // Log the updated blog post to the console
    console.log('Comment added successfully: ', blog);
    // Return a 200 (OK) response with a success message
    res.status(200).json({ message: 'Comment added successfully', blog });
  } catch (error) {
    // Log the error message to the console
    console.error('Error adding comment: ', error.message);
    // Return a 500 (Internal Server Error) response with an error message
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a comment (authenticated users only, must be the original commenter or an admin)
/**
 * This function allows authenticated users to update a comment. It takes a comment ID and a blog post ID as parameters and
 * the updated comment as the request body. It checks if the user is authenticated and has the "admin" role or if the user is
 * the original commenter. If the user does not have permission to update the comment, it returns a 403 (Forbidden) response
 * with an error message. If the comment is updated successfully, it returns a 200 (OK) response with the updated comment.
 *
 * @param {AuthenticatedRequest} req - Express request object with authenticated user information
 * @param {Response} res - Express response object
 */
export const updateComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { blogId, commentId } = req.params;
    const { comment } = req.body;

    console.log(
      `Updating comment with ID: ${commentId} in blog post with ID: ${blogId}`,
    );

    // Check if the blog ID and comment ID are valid
    if (
      !mongoose.Types.ObjectId.isValid(blogId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      console.log('Invalid blog ID or comment ID');
      return res.status(400).json({ message: 'Invalid blog ID or comment ID' });
    }

    // Check if the comment is empty
    if (!comment || comment.trim().length === 0) {
      console.log('Comment cannot be empty');
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    // Fetch the blog post with the given ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      console.log('Blog not found');
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Log the blog post to the console
    console.log('Blog found: ', blog);

    // Fetch the comment with the given ID
    const commentToUpdate = blog.comments.find(
      (comment) => comment._id.toString() === commentId,
    );
    if (!commentToUpdate) {
      console.log('Comment not found');
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Log the comment to the console
    console.log('Comment to update: ', commentToUpdate);

    // Check if the user has permission to update the comment
    // The user must be the original commenter or have the "admin" role
    if (
      commentToUpdate.commenter.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      console.log('User does not have permission to update comment');
      return res.status(403).json({
        message: 'You can only edit your own comments or you must be an admin',
      });
    }

    // Update the comment
    commentToUpdate.comment = sanitizeInput(comment);
    // If the user is an admin and not the original commenter, set the editedByAdmin flag to true
    if (
      req.user.role === 'admin' &&
      req.user.id !== commentToUpdate.commenter.toString()
    ) {
      commentToUpdate.editedByAdmin = true;
    }
    // Save the updated blog post
    await blog.save();

    // Log the updated comment to the console
    console.log('Comment updated successfully: ', commentToUpdate);
    // Return a 200 (OK) response with the updated comment
    res.status(200).json({
      message: 'Comment updated successfully',
      comment: commentToUpdate,
    });
  } catch (error) {
    console.error('Error updating comment: ', error.message);
    // Return a 500 (Internal Server Error) response with an error message
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete a comment from a blog post. Only the original commenter or an admin
 * can delete a comment.
 *
 * This function takes a blog post ID and a comment ID as parameters. It first
 * checks if the blog ID and comment ID are valid. If they are not, it returns
 * a 400 (Bad Request) response with an error message.
 *
 * If the IDs are valid, it fetches the blog post with the given ID from the
 * database. If the blog post is not found, it returns a 404 (Not Found)
 * response with an error message.
 *
 * If the blog post is found, it fetches the comment with the given ID from the
 * blog post. If the comment is not found, it returns a 404 (Not Found)
 * response with an error message.
 *
 * If the comment is found, it checks if the user has permission to delete the
 * comment. The user must be the original commenter or an admin. If the user
 * does not have permission, it returns a 403 (Forbidden) response with an
 * error message.
 *
 * If the user has permission, it finds the index of the comment to delete in
 * the blog post's comments array. It then uses the splice() method to remove
 * the comment from the array.
 *
 * Finally, it saves the updated blog post to the database and returns a 200
 * (OK) response with a success message.
 *
 * @param {AuthenticatedRequest} req - Express request object with
 * authenticated user information
 * @param {Response} res - Express response object
 */
export const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const blogId = req.params.blogId;
    const commentId = req.params.commentId;

    console.log('Deleting comment with ID: ', commentId);

    // Check if the blog ID and comment ID are valid
    if (
      !mongoose.Types.ObjectId.isValid(blogId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      console.log('Invalid blog ID or comment ID');
      return res.status(400).json({ message: 'Invalid blog ID or comment ID' });
    }

    // Fetch the blog post with the given ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      console.log('Blog not found');
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Fetch the comment with the given ID
    const comment = blog.comments.find(
      (comment) => comment._id.toString() === commentId,
    );
    if (!comment) {
      console.log('Comment not found');
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user has permission to delete the comment
    // The user must be the original commenter or an admin
    if (
      comment.commenter.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      console.log('User does not have permission to delete comment');
      return res.status(403).json({
        message:
          'You can only delete your own comments or you must be an admin',
      });
    }

    // Find the index of the comment to delete
    const index = blog.comments.findIndex(
      (comment) => comment._id.toString() === commentId,
    );
    console.log('Index of comment to delete: ', index);

    // Remove the comment from the blog post using splice
    blog.comments.splice(index, 1);
    console.log('Comments after deletion: ', blog.comments);

    // Save the updated blog post
    await blog.save();
    console.log('Updated blog post: ', blog);

    // Return a 200 (OK) response with a success message
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment: ', error.message);
    // Return a 500 (Internal Server Error) response with an error message
    res.status(500).json({ message: 'Internal server error' });
  }
};
