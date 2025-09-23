# Email Setup Guide

## Current Issue
You're experiencing a Gmail SMTP authentication error: `535-5.7.8 Username and Password not accepted`. This is because Gmail requires App Passwords for SMTP authentication, not regular passwords.

## Solution: Configure Gmail App Password

### Step 1: Enable 2-Step Verification
1. Go to your [Google Account](https://myaccount.google.com/)
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", find **2-Step Verification**
4. If not enabled, click **Get started** and follow the setup process

### Step 2: Generate App Password
1. In the same Security section, look for **App passwords**
2. You may need to sign in again
3. Click **Select app** and choose **Mail**
4. Click **Select device** and choose **Other (custom name)**
5. Type "Taatai Surguuli Backend" or any descriptive name
6. Click **Generate**
7. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Create Environment File
Create a `.env.local` file in the `/backend` directory with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/taatai-surguuli

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=your-email@gmail.com

# Development settings
NODE_ENV=development
```

**Important Notes:**
- Replace `your-email@gmail.com` with your actual Gmail address
- Replace `your-16-character-app-password` with the App Password you generated
- Replace `your-jwt-secret-key-here` with a secure random string
- The App Password should NOT have spaces (remove them if they appear)

### Step 4: Restart Your Backend Server
After creating the `.env.local` file, restart your backend development server:

```bash
cd backend
npm run dev
```

### Step 5: Test Email Functionality
Try the forgot password functionality again. You should now see:
- `✅ OTP email sent to [email]` in the console
- The email should be delivered to the user's inbox

## Troubleshooting

### If you still get authentication errors:
1. **Double-check the App Password**: Make sure there are no spaces and it's exactly 16 characters
2. **Verify 2-Step Verification is enabled**: App passwords only work with 2-Step Verification
3. **Check the email address**: Ensure the `SMTP_USER` matches your Gmail address exactly
4. **Wait a few minutes**: Sometimes it takes a few minutes for App Passwords to become active

### If you get connection errors:
1. **Check your internet connection**
2. **Verify firewall settings**: Make sure port 587 is not blocked
3. **Try a different network**: Some corporate networks block SMTP

### Alternative Email Providers
If you prefer not to use Gmail, you can use other SMTP providers:

#### Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

#### SendGrid (recommended for production):
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## Security Notes
- Never commit `.env.local` to version control
- Use different credentials for development and production
- Consider using environment variables in your deployment platform
- For production, consider using a dedicated email service like SendGrid or AWS SES

## Current Status
✅ Mail handler updated with better error messages  
✅ Configuration logging added  
✅ Gmail App Password support configured  
✅ Enhanced error handling implemented  

The system will now provide clear error messages when email configuration is missing or incorrect.
