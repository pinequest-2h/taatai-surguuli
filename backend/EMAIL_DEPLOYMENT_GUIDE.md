# Email Configuration for Deployment

## Issue: Connection Timeout (ETIMEDOUT)

The deployed backend is experiencing connection timeouts when trying to send emails through Nodemailer. This is a common issue in cloud deployments.

## Root Causes

1. **Missing Environment Variables**: SMTP configuration not set in deployment
2. **Network Restrictions**: Some cloud providers restrict outbound SMTP connections
3. **Timeout Settings**: Default timeouts may be too long for cloud environments
4. **TLS Configuration**: Incorrect TLS settings for deployment

## Solutions Implemented

### 1. Enhanced Nodemailer Configuration

Updated `src/utils/mail-handler.ts` with deployment-optimized settings:

- **Reduced timeouts**: 30s connection, 15s greeting, 30s socket
- **Optimized connection pool**: 2 max connections, 10 max messages
- **Enhanced TLS settings**: Added ciphers and secure protocol
- **Connection verification**: Verify SMTP connection before sending
- **Better error handling**: Improved retry logic with jitter

### 2. Environment Variables Required

Add these environment variables in your Render dashboard:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=your-email@gmail.com
```

### 3. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this 16-character password (not your regular password)

## Deployment Steps

### Option 1: Render Dashboard (Recommended)

1. Go to your Render dashboard
2. Select your backend service
3. Go to Environment tab
4. Add the following environment variables:

```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-16-char-app-password
SMTP_FROM = your-email@gmail.com
```

5. Redeploy your service

### Option 2: Render CLI

```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render login

# Set environment variables
render env set SMTP_HOST smtp.gmail.com
render env set SMTP_PORT 587
render env set SMTP_USER your-email@gmail.com
render env set SMTP_PASS your-16-char-app-password
render env set SMTP_FROM your-email@gmail.com
```

## Alternative Email Services

If Gmail SMTP continues to have issues, consider these alternatives:

### 1. SendGrid (Recommended for Production)

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### 2. Mailgun

```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-smtp-username
SMTP_PASS=your-mailgun-smtp-password
```

### 3. Amazon SES

```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```

## Testing Email Configuration

After deployment, test the email functionality:

1. Try to reset a password or verify an email
2. Check the application logs for email status
3. Look for these log messages:
   - `✅ SMTP connection verified` - Connection successful
   - `✅ Email sent successfully` - Email sent
   - `⚠️ Email send attempt X failed` - Retry in progress
   - `❌ All X email attempts failed` - All retries failed

## Troubleshooting

### Common Issues

1. **Still getting timeouts**: Try a different email service (SendGrid recommended)
2. **Authentication errors**: Verify your app password is correct
3. **Port blocked**: Some providers block port 587, try port 465 with `secure: true`
4. **Rate limiting**: The new configuration includes rate limiting to prevent issues

### Debug Mode

To enable debug logging, set:
```bash
NODE_ENV=development
```

This will show detailed SMTP communication logs.

## Security Notes

- Never commit email credentials to version control
- Use environment variables for all sensitive data
- Consider using a dedicated email service for production
- Regularly rotate your email credentials

## Performance Optimizations

The updated configuration includes:
- Connection pooling for better performance
- Rate limiting to prevent spam detection
- Exponential backoff with jitter for retries
- Connection verification to catch issues early
