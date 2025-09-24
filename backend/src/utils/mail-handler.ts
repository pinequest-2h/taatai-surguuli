import nodemailer from 'nodemailer';

const isEmailConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;


if (!isEmailConfigured) {
}

const transporter = isEmailConfigured ? nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
    secureProtocol: 'TLSv1_2_method'
  },
  connectionTimeout: 30000, // 30 seconds (reduced from 60)
  greetingTimeout: 15000,   // 15 seconds (reduced from 30)
  socketTimeout: 30000,     // 30 seconds (reduced from 60)
  
  pool: true,
  maxConnections: 2, // Reduced for better stability
  maxMessages: 10,   // Reduced for better stability
  rateDelta: 30000,  // 30 seconds
  rateLimit: 3,      // max 3 messages per rateDelta
  
  requireTLS: true,
  debug: process.env.NODE_ENV === 'development',
  logger: process.env.NODE_ENV === 'development'
}) : null;

class EmailQueue {
  private queue: Array<{email: string, otp: string, type: 'otp' | 'verification', mailOptions: Record<string, unknown>}> = [];
  private processing = false;

  async add(email: string, otp: string, type: 'otp' | 'verification', mailOptions: Record<string, unknown>) {
    this.queue.push({ email, otp, type, mailOptions });
    if (!this.processing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    this.processing = true;
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        try {
          await sendEmailWithRetry(item.mailOptions);
        } catch {
        }
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
      
      // Verify connection before sending
      if (attempt === 1) {
        await transporter!.verify();
      }
      
      await transporter!.sendMail(mailOptions);
      return;
    } catch (error) {
      lastError = error;
      
      // Don't retry on authentication errors or permanent failures
      if (error && typeof error === 'object') {
        const err = error as Record<string, unknown>;
        if (err.code === 'EAUTH' || err.responseCode === 535 || err.code === 'EENVELOPE') {
          throw error;
        }
      }
      
      // Wait before retrying (exponential backoff with jitter)
      if (attempt < maxRetries) {
        const baseDelay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        const jitter = Math.random() * 1000; // Add up to 1s of jitter
        const delay = baseDelay + jitter;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  if (!isEmailConfigured) {
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

  await emailQueue.add(email, otp, 'otp', mailOptions);
};

export const sendVerificationEmail = async (email: string, otp: string): Promise<void> => {
  if (!isEmailConfigured) {
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

  await emailQueue.add(email, otp, 'verification', mailOptions);
};