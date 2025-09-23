import nodemailer from 'nodemailer';

// Check if email is properly configured
const isEmailConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;


if (!isEmailConfigured) {
  console.log('⚠️ Email not configured - Missing SMTP_USER or SMTP_PASS environment variables');
  console.log('📧 To enable email functionality, create a .env.local file with:');
  console.log('   SMTP_USER=your-email@gmail.com');
  console.log('   SMTP_PASS=your-16-character-app-password');
  console.log('   SMTP_HOST=smtp.gmail.com');
  console.log('   SMTP_PORT=587');
  console.log('   SMTP_FROM=your-email@gmail.com');
}

const transporter = isEmailConfigured ? nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // For development only
    ciphers: 'SSLv3',
    secureProtocol: 'TLSv1_2_method'
  },
  // Enhanced connection timeout settings for deployment
  connectionTimeout: 30000, // 30 seconds (reduced from 60)
  greetingTimeout: 15000,   // 15 seconds (reduced from 30)
  socketTimeout: 30000,     // 30 seconds (reduced from 60)
  
  // Connection pool settings optimized for deployment
  pool: true,
  maxConnections: 2, // Reduced for better stability
  maxMessages: 10,   // Reduced for better stability
  rateDelta: 30000,  // 30 seconds
  rateLimit: 3,      // max 3 messages per rateDelta
  
  // Additional deployment-friendly settings
  requireTLS: true,
  debug: process.env.NODE_ENV === 'development',
  logger: process.env.NODE_ENV === 'development'
}) : null;

// Simple email queue for better performance
class EmailQueue {
  private queue: Array<{email: string, otp: string, type: 'otp' | 'verification', mailOptions: Record<string, unknown>}> = [];
  private processing = false;

  async add(email: string, otp: string, type: 'otp' | 'verification', mailOptions: Record<string, unknown>) {
    this.queue.push({ email, otp, type, mailOptions });
    if (!this.processing) {
      this.processQueue();
    }
    console.log(`📧 Email queued for ${email} (${type})`);
  }

  private async processQueue() {
    this.processing = true;
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        try {
          await sendEmailWithRetry(item.mailOptions);
          console.log(`✅ Queued email sent to ${item.email}`);
        } catch (error) {
          console.error(`❌ Failed to send queued email to ${item.email}:`, error);
        }
        // Small delay between emails to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    this.processing = false;
  }
}

const emailQueue = new EmailQueue();

const sendEmailWithRetry = async (mailOptions: Record<string, unknown>, maxRetries: number = 3): Promise<void> => {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📧 Attempting to send email (attempt ${attempt}/${maxRetries})`);
      
      // Verify connection before sending
      if (attempt === 1) {
        await transporter!.verify();
        console.log(`✅ SMTP connection verified`);
      }
      
      await transporter!.sendMail(mailOptions);
      console.log(`✅ Email sent successfully on attempt ${attempt}`);
      return;
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Email send attempt ${attempt} failed:`, error);
      
      // Don't retry on authentication errors or permanent failures
      if (error && typeof error === 'object') {
        const err = error as Record<string, unknown>;
        if (err.code === 'EAUTH' || err.responseCode === 535 || err.code === 'EENVELOPE') {
          console.error(`❌ Permanent email error, not retrying:`, err.code);
          throw error;
        }
      }
      
      // Wait before retrying (exponential backoff with jitter)
      if (attempt < maxRetries) {
        const baseDelay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        const jitter = Math.random() * 1000; // Add up to 1s of jitter
        const delay = baseDelay + jitter;
        console.log(`⏳ Waiting ${Math.round(delay)}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`❌ All ${maxRetries} email attempts failed`);
  throw lastError;
};

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  // Skip email sending if not configured
  if (!isEmailConfigured) {
    console.log(`⚠️ Email not configured - OTP for ${email}: ${otp}`);
    return;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@erulsetegel.com',
    to: email,
    subject: 'Password Reset OTP - Eruul setegel',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #E4405F; margin: 0;">Eruul setegel</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #666; margin-bottom: 30px; line-height: 1.6;">
            We received a request to reset your password. Use the OTP below to complete the process:
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 2px dashed #E4405F; margin: 30px 0;">
            <h1 style="color: #E4405F; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
            This OTP is valid for 10 minutes only.
          </p>
          <p style="color: #999; font-size: 12px; line-height: 1.4;">
            If you didn't request this password reset, please ignore this email or contact support if you have concerns.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>© 2024 Eruul setegel. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  // Queue email for async processing - non-blocking
  await emailQueue.add(email, otp, 'otp', mailOptions);
  console.log(`OTP email queued for ${email}`);
};

export const sendVerificationEmail = async (email: string, otp: string): Promise<void> => {
  // Skip email sending if not configured
  if (!isEmailConfigured) {
    console.log(`⚠️ Email not configured - Verification OTP for ${email}: ${otp}`);
    return;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@erulsetegel.com',
    to: email,
    subject: 'Email Verification - Eruul setegel',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #E4405F; margin: 0;">Eruul setegel</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome! Verify Your Email</h2>
          <p style="color: #666; margin-bottom: 30px; line-height: 1.6;">
            Thank you for signing up! Please verify your email address using the OTP below to complete your registration:
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 2px dashed #E4405F; margin: 30px 0;">
            <h1 style="color: #E4405F; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
            This verification code is valid for 10 minutes only.
          </p>
          <p style="color: #999; font-size: 12px; line-height: 1.4;">
            If you didn't create an account with us, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>© 2024 Eruul setegel. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  // Queue email for async processing - non-blocking
  await emailQueue.add(email, otp, 'verification', mailOptions);
  console.log(`Verification email queued for ${email}`);
};