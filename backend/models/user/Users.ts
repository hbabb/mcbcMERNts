import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'user';
  tokens: { token: string }[];
  generateAuthToken(): Promise<string>;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 7
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'user'],
    default: 'user'
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

  /**
   * Generates a new JSON Web Token for the user.
   * The token is stored in the user's document in the database.
   * The token is signed with the JWT_SECRET environment variable.
   * The token is returned as a Promise.
   *
   * The logic for generating the token is as follows:
   * 1. The user's _id property is converted to a string using the toString() method.
   * 2. The string is used as the payload for the token.
   * 3. The payload is signed with the JWT_SECRET environment variable using the jwt.sign() method.
   * 4. The signed token is added to the user's tokens array in their document.
   * 5. The user's document is saved to the database using the save() method.
   * 6. The generated token is returned as a Promise.
   */
userSchema.methods.generateAuthToken = async function() {
  // Get the user document that this method is being called on
  const user = this;
  console.log('Generating new token for user: ', user);

  // Get the user's _id property and convert it to a string
  // This is the payload for the token
  const payload = { _id: user._id.toString() };
  console.log('Payload for token: ', payload);

  // Sign the payload with the JWT_SECRET environment variable
  // This will generate a new JSON Web Token
  const token = jwt.sign(payload, process.env.JWT_SECRET as string);
  console.log('Generated token: ', token);

  // Add the new token to the user's tokens array in their document
  user.tokens = user.tokens.concat({ token });
  console.log('Updated tokens array: ', user.tokens);

  // Save the user's document to the database
  console.log('Saving user with new token');
  await user.save();
  console.log('User saved with new token');

  // Return the generated token as a Promise
  return token;
};

/**
 * Compares the given password to the password stored in the database.
 * This method is called on a user document and takes a password string as an argument.
 * It uses the bcrypt.compare() method to compare the given password to the password
 * stored in the database. The result of the comparison is returned as a Promise.
 * @param {string} password - The password to compare
 * @returns {Promise<boolean>} - A Promise that is resolved with a boolean indicating whether the password is valid
 *
 * The logic for comparing the passwords is as follows:
 * 1. The given password is logged to the console for debugging purposes.
 * 2. The password stored in the database is logged to the console for debugging purposes.
 * 3. The bcrypt.compare() method is called with the given password and the password stored in the database.
 * 4. The result of the comparison is logged to the console for debugging purposes.
 * 5. The result of the comparison is returned as a Promise.
 */
userSchema.methods.comparePassword = async function(password: string) {
  console.log('Comparing given password: ', password);
  console.log('With password in database: ', this.password);
  const result = await bcrypt.compare(password, this.password);
  console.log('Result of comparison: ', result);
  return result;
};

userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;