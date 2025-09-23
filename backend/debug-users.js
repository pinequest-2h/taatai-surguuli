// Debug script to check users in the database
// Run this with: node debug-users.js

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

async function debugUsers() {
  try {
    // Connect to MongoDB
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/taatai-surguuli';
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');

    // Show database info
    console.log('\n📊 Database Info:');
    console.log('Database Name:', mongoose.connection.db.databaseName);
    console.log('Collection Name:', User.collection.name);

    // Count total users
    const totalUsers = await User.countDocuments();
    console.log(`\n👥 Total Users: ${totalUsers}`);

    // Find users with emails
    const usersWithEmails = await User.find({ email: { $exists: true, $ne: null } });
    console.log(`\n📧 Users with emails: ${usersWithEmails.length}`);

    // Show all users with emails
    console.log('\n📋 All users with emails:');
    usersWithEmails.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id}`);
      console.log(`   Email: "${user.email}"`);
      console.log(`   Username: "${user.userName}"`);
      console.log(`   Full Name: "${user.fullName}"`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    // Search for specific email
    const searchEmail = 'mmfg76996@gmail.com';
    console.log(`\n🔍 Searching for email: "${searchEmail}"`);
    const foundUser = await User.findOne({ email: searchEmail });
    
    if (foundUser) {
      console.log('✅ Found user:');
      console.log('   ID:', foundUser._id);
      console.log('   Email:', foundUser.email);
      console.log('   Username:', foundUser.userName);
      console.log('   Full Name:', foundUser.fullName);
      console.log('   Created:', foundUser.createdAt);
    } else {
      console.log('❌ User not found with that email');
      
      // Try case-insensitive search
      console.log(`\n🔍 Trying case-insensitive search...`);
      const caseInsensitiveUser = await User.findOne({ 
        email: { $regex: new RegExp(`^${searchEmail}$`, 'i') }
      });
      
      if (caseInsensitiveUser) {
        console.log('✅ Found user with case-insensitive search:');
        console.log('   ID:', caseInsensitiveUser._id);
        console.log('   Email:', caseInsensitiveUser.email);
        console.log('   Username:', caseInsensitiveUser.userName);
        console.log('   Full Name:', caseInsensitiveUser.fullName);
        console.log('   Created:', caseInsensitiveUser.createdAt);
      } else {
        console.log('❌ Still not found with case-insensitive search');
      }
    }

    // Show indexes
    console.log('\n📇 Collection Indexes:');
    const indexes = await User.collection.getIndexes();
    console.log(JSON.stringify(indexes, null, 2));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

debugUsers();
