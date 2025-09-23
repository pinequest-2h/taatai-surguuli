// Database optimization script
// Run this with: node optimize-database.js

const mongoose = require('mongoose');

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
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');

    console.log('\n📊 Database Optimization Starting...\n');

    // Create indexes for User collection
    console.log('👥 Creating indexes for User collection...');
    
    try {
      await User.collection.createIndex({ "email": 1 }, { unique: true, sparse: true });
      console.log('✅ Created unique index on email field');
    } catch (error) {
      if (error.code === 11000) {
        console.log('ℹ️ Email index already exists');
      } else {
        console.error('❌ Error creating email index:', error.message);
      }
    }

    try {
      await User.collection.createIndex({ "userName": 1 }, { unique: true });
      console.log('✅ Created unique index on userName field');
    } catch (error) {
      if (error.code === 11000) {
        console.log('ℹ️ userName index already exists');
      } else {
        console.error('❌ Error creating userName index:', error.message);
      }
    }

    try {
      await User.collection.createIndex({ "role": 1 });
      console.log('✅ Created index on role field');
    } catch (error) {
      console.error('❌ Error creating role index:', error.message);
    }

    try {
      await User.collection.createIndex({ "createdAt": -1 });
      console.log('✅ Created index on createdAt field (descending)');
    } catch (error) {
      console.error('❌ Error creating createdAt index:', error.message);
    }

    // Create indexes for Report collection
    console.log('\n📋 Creating indexes for Report collection...');
    
    try {
      await Report.collection.createIndex({ "userId": 1 });
      console.log('✅ Created index on userId field for reports');
    } catch (error) {
      console.error('❌ Error creating userId index for reports:', error.message);
    }

    try {
      await Report.collection.createIndex({ "psychologistId": 1 });
      console.log('✅ Created index on psychologistId field for reports');
    } catch (error) {
      console.error('❌ Error creating psychologistId index for reports:', error.message);
    }

    try {
      await Report.collection.createIndex({ "createdAt": -1 });
      console.log('✅ Created index on createdAt field for reports (descending)');
    } catch (error) {
      console.error('❌ Error creating createdAt index for reports:', error.message);
    }

    try {
      await Report.collection.createIndex({ "isPrivate": 1 });
      console.log('✅ Created index on isPrivate field for reports');
    } catch (error) {
      console.error('❌ Error creating isPrivate index for reports:', error.message);
    }

    // Show all indexes
    console.log('\n📇 Current Indexes:');
    
    const userIndexes = await User.collection.getIndexes();
    console.log('\n👥 User Collection Indexes:');
    Object.keys(userIndexes).forEach(indexName => {
      console.log(`  - ${indexName}: ${JSON.stringify(userIndexes[indexName].key)}`);
    });

    const reportIndexes = await Report.collection.getIndexes();
    console.log('\n📋 Report Collection Indexes:');
    Object.keys(reportIndexes).forEach(indexName => {
      console.log(`  - ${indexName}: ${JSON.stringify(reportIndexes[indexName].key)}`);
    });

    // Performance statistics
    console.log('\n📈 Performance Statistics:');
    
    const userCount = await User.countDocuments();
    const reportCount = await Report.countDocuments();
    
    console.log(`Total Users: ${userCount}`);
    console.log(`Total Reports: ${reportCount}`);

    console.log('\n🎉 Database optimization completed successfully!');

  } catch (error) {
    console.error('❌ Database optimization failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

optimizeDatabase();
