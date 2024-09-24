import path from 'path';
import { fileURLToPath } from 'url';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Import routes
// TODO: Import your route files here
import blogRoutes from './routes/blogRoutes.js';

// Resolve the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to the .env file
const envPath = path.resolve(__dirname, '../.env');

// Load the environment variables from the .env file
dotenv.config({ path: envPath });

// Import the database connection
import { connectDB } from './config/db.js';

// Connect to the database
connectDB();

const app: express.Application = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan('dev'));

// Body parsing middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie parsing middleware
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
// TODO: use your route files here
app.use('/api/blog', blogRoutes);

// Check if the server is running
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Construct ports
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;