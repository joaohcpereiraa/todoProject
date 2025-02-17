import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../../config';

export default async (): Promise<Db> => {
  try {
    const connection = await mongoose.connect(config.databaseURL, {
      serverSelectionTimeoutMS: config.timeoutMS || 30000, // Set timeout correctly
    });

    console.log('✅ MongoDB connected successfully!');
    return connection.connection.db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1); // Stop the application if DB fails to connect
  }
};
