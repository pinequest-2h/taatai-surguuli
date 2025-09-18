import { connect } from "mongoose";

export const connectToDb = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      console.error("❌ MONGODB_URL environment variable is not set");
      throw new Error("MONGODB_URL environment variable is not set");
    }

    console.log("🔌 Attempting to connect to MongoDB...");
    console.log("📍 MongoDB URL:", process.env.MONGODB_URL.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    await connect(process.env.MONGODB_URL);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  }
};
