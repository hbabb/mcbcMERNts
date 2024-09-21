import { Request, Response } from 'express';
import User, { IUser } from '../../models/user/Users';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

/**
 * Register a new user
 *
 * This function takes a request object with a username, email, and password
 * as the request body. It creates a new user in the database and returns
 * a JSON response with the new user and a JSON Web Token (JWT) for the user.
 *
 * This function is called when a user submits the registration form on the
 * client side. It is called by the Express router and passed the request
 * object as an argument. The request object contains the username, email,
 * and password entered by the user as the request body.
 *
 * The function first checks if the request is valid. If the request is not
 * valid, it returns a 400 (Bad Request) response with an error message.
 *
 * The function then creates a new user object with the input from the request
 * body. It uses the User model to create a new user document in the database.
 * The User model is defined in the user model file and has a schema that
 * specifies the properties of a user document. The new user object is created
 * with the username, email, and password entered by the user as the request
 * body.
 *
 * The function then saves the user to the database using the save() method of
 * the User model. This method saves the user document to the database and
 * returns a promise that is resolved when the user is saved. The promise is
 * resolved with the saved user document.
 *
 * The function then generates a JWT for the user using the generateAuthToken()
 * method of the User model. This method generates a JWT for the user and
 * returns a promise that is resolved with the JWT.
 *
 * Finally, the function returns a JSON response with the new user and the JWT.
 * The response is sent back to the client and contains the user document and
 * the JWT. The JWT is sent in the response as the "token" property of the
 * response object.
 *
 * @param {Request} req - Express request object with the new user information
 * as the request body
 * @param {Response} res - Express response object
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    // Get the username, email, and password from the request body
    // The request body is an object that contains the username, email, and
    // password entered by the user
    const { username, email, password } = req.body;
    console.log('Registering user: ', { username, email, password });
    // Create a new user object with the input from the request body
    // The new user object is created with the username, email, and password
    // entered by the user
    const user = new User({ username, email, password });
    console.log('Saving user: ', user);
    // Save the user to the database
    // The save() method of the User model is called to save the user
    // document to the database
    await user.save();
    console.log('User saved: ', user);
    // Generate a JWT for the user
    // The generateAuthToken() method of the User model is called to generate
    // a JWT for the user
    console.log('Generating token for user: ', user);
    const token = await user.generateAuthToken();
    console.log('Token generated: ', token);
    // Return a JSON response with the new user and the JWT
    // The response is sent back to the client and contains the user document
    // and the JWT
    console.log('Returning user and token: ', { user, token });
    res.status(201).json({ user, token });
  } catch (error) {
    console.log('Error registering user: ', error);
    // Return a 400 (Bad Request) response with an error message
    // If there is an error saving the user, the function returns a 400
    // response with an error message
    res.status(400).json({ error: error.message });
  }
};

/**
 * Log in a user
 * @param {Request} req - Express request object with the email and password
 * entered by the user
 * @param {Response} res - Express response object
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    console.log('Logging in user');
    console.log('Getting email and password from request body');
    // Get the email and password from the request body
    // The request body is an object that contains the email and password
    // entered by the user
    const { email, password } = req.body;
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('Finding user with given email');
    // Find the user with the given email
    // The User model is used to find a user with the given email
    // The findOne() method is used to search for a user with the given email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      // If the user is not found, throw an error
      // The error is thrown with the message 'Invalid login credentials'
      throw new Error('Invalid login credentials');
    }
    console.log('Comparing passwords');
    // Compare the passwords
    // The comparePassword() method of the User model is used to compare the
    // password in the request body with the password of the user in the
    // database
    const passwordIsValid = await user.comparePassword(password);
    if (!passwordIsValid) {
      console.log('Passwords do not match');
      // If the passwords do not match, throw an error
      // The error is thrown with the message 'Invalid login credentials'
      throw new Error('Invalid login credentials');
    }
    console.log('Generating token for user');
    // Generate a JWT for the user
    // The generateAuthToken() method of the User model is used to generate a
    // JWT for the user
    const token = await user.generateAuthToken();
    console.log('Returning user and token');
    // Return a JSON response with the user document and the JWT
    // The response is an object with the user document and the JWT
    res.json({ user, token });
  } catch (error) {
    console.log('Error logging in user: ', error);
    // Return a 400 (Bad Request) response with an error message
    // If there is an error logging in the user, the function returns a 400
    // response with an error message
    res.status(400).json({ error: error.message });
  }
};

/**
 * Log out a user
 * This function takes an authenticated request object and a response object.
 * It logs out the user by removing the JWT from the user's token array and
 * saving the user to the database.
 * The user's tokens array is an array of objects, where each object has a token
 * property that contains the JWT that is used to authenticate the user.
 * The function filters the tokens array to remove the JWT that is currently
 * being used to authenticate the user.
 * If there is an error logging out the user, the function returns a 500
 * (Internal Server Error) response with an error message.
 * @param {AuthenticatedRequest} req - An authenticated request object with
 * the user document and the JWT
 * @param {Response} res - A response object
 */
export const logoutUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('Logging out user');
    // The user's tokens array is filtered to remove the JWT that is currently
    // being used to authenticate the user
    console.log('Before filtering tokens array: ', req.user.tokens);
    req.user.tokens = req.user.tokens.filter((token) => {
      console.log('Comparing token: ', token.token, ' with: ', req.token);
      return token.token !== req.token;
    });
    console.log('After filtering tokens array: ', req.user.tokens);
    // The user is saved to the database with the updated tokens array
    console.log('Saving user to database');
    await req.user.save();
    console.log('User logged out');
    // A 200 (OK) response is sent back to the client
    res.send();
  } catch (error) {
    console.log('Error logging out user: ', error);
    // If there is an error logging out the user, a 500 (Internal Server Error)
    // response is returned with an error message
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get the profile of the user that is currently authenticated
 *
 * This function takes an authenticated request object and a response object.
 * It returns the user document of the user that is currently authenticated in
 * the response object.
 *
 * The function first logs a message to the console indicating that it is
 * getting the user profile.
 * It then logs the user document to the console to help with debugging.
 * Finally, it returns the user document in the response object as a JSON
 * response. The user document is an object with the user's properties such as
 * username, email, and password.
 * @param {AuthenticatedRequest} req - An authenticated request object with
 * the user document of the user that is currently authenticated
 * @param {Response} res - A response object to return the user document in
 */
export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  // Log a message to the console indicating that we are getting the user profile
  console.log('Getting user profile');

  // Log the user document to the console to help with debugging
  console.log('User: ', req.user);

  // Return the user document in the response object as a JSON response
  // The user document is an object with the user's properties such as
  // username, email, and password
  res.json(req.user);
};

/**
 * Update the profile of the user that is currently authenticated
 *
 * This function takes an authenticated request object and a response object.
 * It updates the user document of the user that is currently authenticated with
 * the updates in the request body and saves the user document to the database.
 * If the user document is updated successfully, it returns the updated user
 * document in the response object as a JSON response.
 * If there is an error updating the user document, the function returns a 400
 * (Bad Request) response with an error message.
 *
 * The function first logs a message to the console indicating that it is
 * updating the user profile.
 * It then logs the user document to the console to help with debugging.
 * Finally, it updates the user document with the updates in the request body
 * and saves the user document to the database.
 * If the user document is updated successfully, it returns the updated user
 * document in the response object as a JSON response.
 * If there is an error updating the user document, the function returns a 400
 * (Bad Request) response with an error message.
 *
 * @param {AuthenticatedRequest} req - An authenticated request object with
 * the user document of the user that is currently authenticated
 * @param {Response} res - A response object to return the user document in
 */
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  console.log('Updating user profile');

  // The request body is an object with the updates to the user document
  // The updates object is an object with the properties of the user document
  // that need to be updated. The properties are the keys of the object and
  // the values are the values to be updated.
  const updates = Object.keys(req.body);
  console.log('Updates: ', updates);

  // The allowed updates array contains the properties of the user document
  // that can be updated. The properties are the keys of the object and are
  // stored in an array.
  const allowedUpdates = ['username', 'email', 'password'];
  console.log('Allowed updates: ', allowedUpdates);

  // The isValidOperation variable checks if all the updates in the request
  // body are valid. It uses the every() method to check if all the properties
  // in the updates object are in the allowedUpdates array.
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  console.log('IsValidOperation: ', isValidOperation);

  // If the updates are not valid, the function returns a 400 (Bad Request)
  // response with an error message.
  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates!' });
  }

  try {
    console.log('Updating user document');
    // The updates.forEach() method is used to update the user document with
    // the updates in the request body. It iterates over the updates object and
    // sets the value of each property in the user document to the value in the
    // request body.
    updates.forEach((update) => req.user[update] = req.body[update]);
    console.log('Updated user document: ', req.user);

    // The user document is saved to the database using the save() method.
    // If the user document is saved successfully, the function returns the
    // updated user document in the response object as a JSON response.
    await req.user.save();
    console.log('User document updated successfully');
    res.json(req.user);
  } catch (error) {
    console.log('Error updating user document: ', error);
    // If there is an error updating the user document, the function returns a
    // 400 (Bad Request) response with an error message.
    res.status(400).json({ error: error.message });
  }
};

// Admin only: Get all users
/**
 * This function is an admin-only function that gets all users from the database.
 * It is used by the admin to get a list of all users in the database.
 * The function first checks if the user is an admin and if the user is not an admin,
 * it returns a 403 (Forbidden) response with an error message.
 * If the user is an admin, it finds all users in the database and returns them as a JSON response.
 * The function logs messages to the console to help with debugging.
 * @param {AuthenticatedRequest} req - Express request object with authenticated user information
 * @param {Response} res - Express response object
 */
export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  console.log('Getting all users');

  // Check if the user is an admin
  // The user is an admin if the role property of the user document is set to 'admin'
  if (req.user.role !== 'admin') {
    console.log('Access denied. Admin only.');
    // If the user is not an admin, return a 403 (Forbidden) response with an error message
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }

  console.log('Finding all users in the database');
  try {
    // The User model is used to find all users in the database.
    // The find() method is used to search for all users and returns an array of user documents.
    const users = await User.find({});
    console.log('Found users: ', users);
    // The users are returned as a JSON response.
    res.json(users);
  } catch (error) {
    console.log('Error getting all users: ', error);
    // If there is an error finding all users, a 500 (Internal Server Error) response is returned
    // with an error message.
    res.status(500).json({ error: error.message });
  }
};

// Admin only: Update user role
/**
 * This function is an admin-only function that updates the role of a user in the database.
 * It is used by the admin to update the role of a user in the database.
 * The function first checks if the user is an admin and if the user is not an admin,
 * it returns a 403 (Forbidden) response with an error message.
 * If the user is an admin, it updates the role of the user with the given ID to the given role.
 * The function logs messages to the console to help with debugging.
 * @param {AuthenticatedRequest} req - Express request object with authenticated user information
 * @param {Response} res - Express response object
 */
export const updateUserRole = async (req: AuthenticatedRequest, res: Response) => {
  console.log('Updating user role');

  // Check if the user is an admin
  // The user is an admin if the role property of the user document is set to 'admin'
  if (req.user.role !== 'admin') {
    console.log('Access denied. Admin only.');
    // If the user is not an admin, return a 403 (Forbidden) response with an error message
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }

  // Get the user ID and new role from the request body
  const { userId, newRole } = req.body;

  console.log(`Updating user with ID: ${userId} to role: ${newRole}`);

  try {
    // Find the user with the given ID in the database
    const user = await User.findById(userId);

    // Check if the user is found
    if (!user) {
      console.log('User not found');
      // If the user is not found, return a 404 (Not Found) response with an error message
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the role of the user document
    user.role = newRole;

    console.log('Saving user document');

    // Save the updated user document to the database
    await user.save();

    console.log('User document saved successfully');

    // Return the updated user document as a JSON response
    res.json(user);
  } catch (error) {
    console.log('Error updating user role: ', error);
    // If there is an error updating the user role, return a 400 (Bad Request) response with an error message
    res.status(400).json({ error: error.message });
  }
};
