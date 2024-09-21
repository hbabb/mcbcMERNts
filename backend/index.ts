// mcbcMERNts/backend/server.ts

import path from 'path';
import { fileURLToPath } from 'url';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

// Resolve the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to the .env file
const envPath = path.resolve(__dirname, '../.env');

// Load the environment variables from the .env file
dotenv.config({ path: envPath });

// Debug output the environment variables
console.log('MONGO_URL: ', process.env.MONGO_URL);
console.log('PORT: ', process.env.PORT);

// Import the database connection
import { connectDB } from './config/db.js';

// Import the routes

// Connect to the database
connectDB();

const app: express.Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes

// Check if the server is running
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Construct ports
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
