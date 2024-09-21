import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user/Users';

export interface AuthenticatedRequest extends Request {
  [x: string]: any;
  user?: any;
}

/**
 * Middleware that authenticates a user using a JSON Web Token.
 * The token is expected to be in the Authorization header of the request.
 * The token is verified and then used to find the user in the database.
 * If the user is found, the request is passed to the next middleware.
 * If the user is not found or the token is invalid, a 401 response is returned.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function to call.
 */
export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    // The token is expected to be in the format "Bearer <token>".
    // We use the replace() method to strip off the "Bearer " part.
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Log the token to the console for debugging purposes.
    console.log('Authenticating with token: ', token);

    // If the token is not provided, return a 401 response.
    // This means that the request did not include a valid token.
    if (!token) {
      throw new Error('No token provided');
    }

    // Verify the token
    // We use the jwt.verify() method to verify the token.
    // The first argument is the token to verify.
    // The second argument is the secret key used to sign the token.
    // The third argument is an options object.
    // We pass the secret key as a string.
    // We also pass an options object with the algorithms property set to an array
    // containing the algorithm used to sign the token.
    // In this case, we use the HS256 algorithm.
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string, {
      algorithms: ['HS256']
    });

    // Log the decoded token to the console for debugging purposes.
    console.log('Decoded token: ', decoded);

    // Find the user in the database using the decoded token.
    // We use the findOne() method to find a user in the database.
    // The first argument is an object with the query to perform.
    // The query is an object with the _id property set to the _id property
    // of the decoded token, and the tokens.token property set to the token.
    // This query will find a user with the given _id and token.
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    // Log the found user to the console for debugging purposes.
    console.log('Found user: ', user);

    // If the user is not found, return a 401 response.
    // This means that the token was invalid or the user was not found.
    if (!user) {
      throw new Error('User not found');
    }

    // Add the user to the request object.
    // This allows us to access the user in the next middleware.
    req.user = user;

    // Call the next middleware.
    // This allows the request to continue to the next middleware.
    next();
  } catch (error) {
    // Log the error to the console for debugging purposes.
    console.log('Error authenticating: ', error.message);

    // Return a 401 response with an error message.
    // This indicates that the request was invalid.
    res.status(401).send({ error: 'Please authenticate.' });
  }
};
