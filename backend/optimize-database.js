// Database optimization script
// Run this with: node optimize-database.js

import mongoose from 'mongoose';

// User schema (simplified version)
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  phoneNumber: { type: String },
  password: { type: String, required: true },
  profileImage: { type: String },
  gender: { type: String, enum: ["FEMALE", "MALE", "OTHER"], required: true },
  role: { type: String, enum: ["CHILD", "PSYCHOLOGIST", "ADMIN"], required: true },
  isVerified: { type: Boolean, default: false },
  isPrivate: { type: Boolean, default: false },
  bio: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

// Report schema (simplified version)
const reportSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  psychologistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPrivate: { type: Boolean, default: false },
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

async function optimizeDatabase() {
  try {
    // Connect to MongoDB
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/taatai-surguuli';
    await mongoose.connect(mongoUrl);


    // Create indexes for User collection
    
    try {
      await User.collection.createIndex({ "email": 1 }, { unique: true, sparse: true });
    } catch (error) {
      if (error.code === 11000) {
      } else {
      }
    }

    try {
      await User.collection.createIndex({ "userName": 1 }, { unique: true });
    } catch (error) {
      if (error.code === 11000) {
      } else {
      }
    }

    try {
      await User.collection.createIndex({ "role": 1 });
    } catch (error) {
    }

    try {
      await User.collection.createIndex({ "createdAt": -1 });
    } catch (error) {
    }

    // Create indexes for Report collection
    
    try {
      await Report.collection.createIndex({ "userId": 1 });
    } catch (error) {
    }

    try {
      await Report.collection.createIndex({ "psychologistId": 1 });
    } catch (error) {
    }

    try {
      await Report.collection.createIndex({ "createdAt": -1 });
    } catch (error) {
    }

    try {
      await Report.collection.createIndex({ "isPrivate": 1 });
    } catch (error) {
    }

    // Show all indexes
    
    const userIndexes = await User.collection.getIndexes();

    const reportIndexes = await Report.collection.getIndexes();

    // Performance statistics
    
    const userCount = await User.countDocuments();
    const reportCount = await Report.countDocuments();
    


  } catch (error) {
  } finally {
    await mongoose.disconnect();
  }
}

optimizeDatabase();
