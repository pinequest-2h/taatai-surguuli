import { connect } from "mongoose";
import { User } from "../models/User";

export const addIsPrivateFieldMigration = async () => {
  try {
    console.log("🔄 Starting migration: Adding isPrivate field to existing users...");
    

    const result = await User.updateMany(
      { isPrivate: { $exists: false } },
      { $set: { isPrivate: false } }
    );
    
    console.log(`✅ Migration completed: Updated ${result.modifiedCount} users`);
    return result;
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};

if (require.main === module) {
  const runMigration = async () => {
    try {
      if (!process.env.MONGODB_URL) {
        throw new Error("MONGODB_URL environment variable is not set");
      }
      
      await connect(process.env.MONGODB_URL);
      console.log("✅ Connected to MongoDB");
      
      await addIsPrivateFieldMigration();
      
      console.log("🎉 Migration completed successfully!");
      process.exit(0);
    } catch (error) {
      console.error("💥 Migration failed:", error);
      process.exit(1);
    }
  };
  
  runMigration();
}
