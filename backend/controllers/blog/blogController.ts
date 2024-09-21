// mcbcMERNts/backend/controllers/blog/blogController.ts

import mongoose from 'mongoose';

import Blog from '../../models/blog/blog';

/**
 * Controller function to get all blog posts from the database
 * This function is called when the client (i.e. the frontend) makes a GET request to the /blog route
 * The function uses the Blog model to query the MongoDB database and retrieve all blog posts
 * It then sends the retrieved blog posts back to the client in the response
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
export const getAllBlogPosts = async (req, res) => {
  try {
    // Log a message to the console to indicate that the function is being called
    console.log('Getting all blog posts');
    // Use the Blog model to query the MongoDB database and retrieve all blog posts
    const blogPosts = await Blog.find();
    // Log the retrieved blog posts to the console
    console.log('Blog posts: ', blogPosts);
    // Send the retrieved blog posts back to the client in the response
    // Set the status code to 200 to indicate that the request was successful
    res.status(200).json(blogPosts);
  } catch (error) {
    // If there is an error, log the error message to the console
    console.error('Error getting blog posts: ', error.message);
    // Send an error response to the client with a status code of 500
    // Set the response body to an object with a message property containing the error message
    res.status(500).json({ message: error.message });
  }
};

/**
 * Controller to add a comment to a blog post
 * This function is called when the client (i.e. the frontend) makes a PUT request to the /blog/:id route
 * The function does the following:
 * 1. Retrieves the blog post with the specified id from the MongoDB database
 * 2. Adds the comment to the blog post
 * 3. Saves the updated blog post back to the database
 * 4. Sends the updated blog post back to the client in the response
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
export const addComment = async (req, res) => {
  const { _id } = req.params;
  const { commenter, comment } = req.body;
  try {
    console.log('Retrieving blog post with id: ', _id);
    // Retrieve the blog post by id
    const blogPost = await Blog.findById(_id);
    if (!blogPost) {
      console.log('Blog post not found');
      // If the blog post does not exist, send a 404 error response
      return res.status(404).json({ message: 'Blog post not found' });
    }

    console.log('Adding comment to blog post');
    // Add the comment to the blog post
    blogPost.comments.push({ commenter: req.user.name, comment });
    console.log('Saving updated blog post');
    // Save the updated blog post
    await blogPost.save();

    console.log('Sending updated blog post back to client');
    // Send the updated blog post back to the client in the response
    res
      .status(200)
      .json({ message: 'Comment added successfully', blogPost: blogPost });
  } catch (error) {
    console.error('Error adding comment: ', error.message);
    // Log the error message to the console
    // Send an error response to the client with a status code of 500
    res.status(500).json({ message: error.message });
  }
};
