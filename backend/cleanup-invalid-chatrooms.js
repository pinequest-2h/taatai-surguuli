#!/usr/bin/env node

/**
 * Database Cleanup Script - Remove Invalid Chatrooms
 * This script removes chatrooms that have invalid child or psychologist references
 * 
 * Usage: node cleanup-invalid-chatrooms.js
 */

const mongoose = import('mongoose');

// Load environment variables
import('dotenv').config();

// Connect to MongoDB
async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URL || process.env.MONGODB_URI);
  } catch (error) {
    process.exit(1);
  }
}

// Cleanup invalid chatrooms
async function cleanupInvalidChatrooms() {
  try {
    const db = mongoose.connection.db;
    
    

    const invalidChatrooms = await db.collection('chatrooms').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'child',
          foreignField: '_id',
          as: 'childUser'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'psychologist',
          foreignField: '_id',
          as: 'psychologistUser'
        }
      },
      {
        $match: {
          $or: [
            { childUser: { $size: 0 } },
            { psychologistUser: { $size: 0 } }
          ]
        }
      }
    ]).toArray();
    
    
    if (invalidChatrooms.length > 0) {
      
      // Ask for confirmation before deletion
      
      // For automated cleanup, we'll just log the IDs that need attention
      const invalidIds = invalidChatrooms.map(cr => cr._id);
      
      // Optionally delete them automatically (uncomment to enable)
      // const result = await db.collection('chatrooms').deleteMany({
      //   _id: { $in: invalidIds }
      // });
      // console.log(`✅ Deleted ${result.deletedCount} invalid chatrooms`);
    } else {
    }
    
    // Also check for orphaned messages
    const orphanedMessages = await db.collection('chatroommessages').aggregate([
      {
        $lookup: {
          from: 'chatrooms',
          localField: 'chatroom',
          foreignField: '_id',
          as: 'chatroomRef'
        }
      },
      {
        $match: {
          chatroomRef: { $size: 0 }
        }
      }
    ]).toArray();
    
    
    if (orphanedMessages.length > 0) {
      const orphanedIds = orphanedMessages.map(msg => msg._id);
    }
    
  } catch (error) {
  }
}

// Main execution
async function main() {
  await connectToDb();
  await cleanupInvalidChatrooms();
  await mongoose.connection.close();
  process.exit(0);
}

main().catch((error) => {
  process.exit(1);
});
