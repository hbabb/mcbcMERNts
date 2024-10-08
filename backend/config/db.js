// mcbcMERN/backend/config/db.js

import mongoose from 'mongoose';

export const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MongoDB URI not found');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
