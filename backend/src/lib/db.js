import mongoose from "mongoose";

// Cache the connection promise so serverless (Vercel) instances reuse one
// connection instead of opening a new one on every request.
let connectionPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn.connection;
      })
      .catch((error) => {
        connectionPromise = null; // allow a retry on the next call
        console.error("Error in connecting to MongoDB", error);
        throw error;
      });
  }

  return connectionPromise;
};
