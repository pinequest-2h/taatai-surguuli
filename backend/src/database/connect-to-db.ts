import { connect, set } from "mongoose";

export const connectToDb = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      console.error("❌ MONGODB_URL environment variable is not set");
      throw new Error("MONGODB_URL environment variable is not set");
    }

    console.log("🔌 Attempting to connect to MongoDB with optimized settings...");
    console.log("📍 MongoDB URL:", process.env.MONGODB_URL.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    
    // Optimize mongoose settings
    set('strictQuery', true);
    
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      retryWrites: true,
    };
    
    await connect(process.env.MONGODB_URL, options);
    console.log("✅ Connected to MongoDB successfully with optimized connection pool");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  }
};
