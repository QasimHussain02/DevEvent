import mongoose from 'mongoose';

// Define the MongoDB connection URI from environment variables
const MONGODB_URI = process.env.DB_URI;

// Validate that the MongoDB URI is defined


/**
 * Type definition for the cached connection object
 * Stores both the mongoose instance and the connection promise
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Extend the global object to include our mongoose cache
 * This prevents TypeScript errors when accessing global.mongoose
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

/**
 * Cache the database connection across hot reloads in development
 * In development, Next.js can hot reload modules, which would create
 * new connections on each reload. Using a global variable prevents this.
 */
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes and maintains a connection to MongoDB using Mongoose
 * 
 * Connection is cached to prevent multiple connections during development.
 * In production, this ensures we reuse the same connection across serverless
 * function invocations for better performance.
 * 
 * @returns Promise that resolves to the Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

    if (!MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable inside .env.local'
        );
    }
  // If a connection attempt is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering to fail fast
    };

    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ MongoDB connected successfully');
      return mongooseInstance;
    });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise on error so we can retry
    cached.promise = null;
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }

  return cached.conn;
}

export default connectDB;
