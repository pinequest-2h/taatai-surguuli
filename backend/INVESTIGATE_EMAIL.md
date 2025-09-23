# Investigating Email Duplicate Issue

## The Problem
The application says email `mmfg76996@gmail.com` already exists, but you can't find it in your MongoDB shell.

## Possible Causes

### 1. **Different Database/Collection**
The application might be connecting to a different database or collection than you're checking.

### 2. **Case Sensitivity**
MongoDB is case-sensitive. The email might be stored with different capitalization.

### 3. **Hidden Characters**
There might be invisible characters (spaces, tabs, etc.) in the email field.

### 4. **Different Connection String**
The application might be using a different MongoDB connection than your shell.

## Debugging Steps

### Step 1: Run the Debug Script
```bash
cd backend
node debug-users.js
```

This will show you:
- Which database and collection the app is using
- All users with emails
- Specific search for the problematic email
- Database indexes

### Step 2: Check Your MongoDB Shell Connection
Make sure you're connected to the same database. Check your connection string:

```javascript
// In MongoDB shell
db.getName()  // Shows current database name
db.getCollectionNames()  // Shows all collections
```

### Step 3: Search for the Email in MongoDB Shell
```javascript
// Connect to your database first
use your-database-name

// Search for the exact email
db.users.findOne({email: "mmfg76996@gmail.com"})

// Search case-insensitively
db.users.findOne({email: {$regex: /^mmfg76996@gmail.com$/i}})

// Search for emails containing this text
db.users.find({email: {$regex: "mmfg76996"}})

// Show all users with emails
db.users.find({email: {$exists: true, $ne: null}})

// Count total users
db.users.countDocuments()
```

### Step 4: Check for Hidden Characters
```javascript
// This will show the exact characters in the email field
db.users.find({email: {$exists: true}}).forEach(function(user) {
  print("Email: '" + user.email + "' (length: " + user.email.length + ")");
  print("Hex: " + user.email.split('').map(c => c.charCodeAt(0).toString(16)).join(' '));
});
```

### Step 5: Check Database Indexes
```javascript
// Show all indexes on the users collection
db.users.getIndexes()

// This will show if there's a unique index on email
```

## Common Issues and Solutions

### Issue 1: Different Database
**Solution**: Make sure you're connecting to the same database in both places.

### Issue 2: Case Sensitivity
**Solution**: The email might be stored as `MMFG76996@gmail.com` instead of `mmfg76996@gmail.com`.

### Issue 3: Collection Name
**Solution**: The collection might be named differently (e.g., `users` vs `Users`).

### Issue 4: Connection String
**Solution**: Check your `.env.local` file and make sure `MONGODB_URL` points to the same database.

## Next Steps

1. **Run the debug script** to see what the application finds
2. **Compare with your MongoDB shell** results
3. **Check the connection strings** in both places
4. **Look for case differences** or hidden characters

## Expected Debug Output

When you run the debug script, you should see something like:

```
📊 Database Info:
Database Name: your-database-name
Collection Name: users

👥 Total Users: X
📧 Users with emails: Y

📋 All users with emails:
1. ID: 507f1f77bcf86cd799439011
   Email: "mmfg76996@gmail.com"
   Username: "someusername"
   Full Name: "Some Name"
   Created: 2024-01-01T00:00:00.000Z
```

If you see the user in the debug script but not in your MongoDB shell, then there's a connection/database mismatch.

If you don't see the user in either place, then there might be an issue with the duplicate checking logic.

## Quick MongoDB Shell Commands

```javascript
// Quick check - run these in your MongoDB shell
db.getName()
db.users.findOne({email: "mmfg76996@gmail.com"})
db.users.countDocuments({email: {$exists: true}})
db.users.getIndexes()
```
