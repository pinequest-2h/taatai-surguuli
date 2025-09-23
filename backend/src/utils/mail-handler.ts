import nodemailer from 'nodemailer';
import { GraphQLError } from 'graphql';

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
    rejectUnauthorized: false // For development only
  }
}) : null;

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  // Skip email sending if not configured
  if (!isEmailConfigured) {
    console.log(`⚠️ Email not configured - OTP for ${email}: ${otp}`);
    return;
  }

  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@erulsetegel.com',
      to: email,
      subject: 'Password Reset OTP - Eruul setgel',
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

    await transporter!.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error: unknown) {
    console.error('Error sending OTP email:', error);
    
    // Provide more specific error messages based on the error type
    let errorMessage = 'Failed to send OTP email';
    let errorCode = 'EMAIL_SERVICE_ERROR';
    let originalError = 'Unknown error';
    
    if (error && typeof error === 'object') {
      const err = error as Record<string, unknown>;
      
      if (err.code === 'EAUTH') {
        errorMessage = 'Email authentication failed. Please check your SMTP credentials. Make sure you are using an App Password for Gmail.';
        errorCode = 'EMAIL_AUTH_ERROR';
      } else if (err.code === 'ECONNECTION') {
        errorMessage = 'Failed to connect to email server. Please check your SMTP settings.';
        errorCode = 'EMAIL_CONNECTION_ERROR';
      } else if (err.responseCode === 535) {
        errorMessage = 'Gmail authentication failed. Please use an App Password instead of your regular password.';
        errorCode = 'GMAIL_AUTH_ERROR';
      }
      
      if (typeof err.message === 'string') {
        originalError = err.message;
      }
    }
        
    throw new GraphQLError(errorMessage, {
      extensions: {
        code: errorCode,
        originalError
      }
    });
  }
};

export const sendVerificationEmail = async (email: string, otp: string): Promise<void> => {
  // Skip email sending if not configured
  if (!isEmailConfigured) {
    console.log(`⚠️ Email not configured - Verification OTP for ${email}: ${otp}`);
    return;
  }

  try {
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

    await transporter!.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error: unknown) {
    console.error('Error sending verification email:', error);
    
    // Provide more specific error messages based on the error type
    let errorMessage = 'Failed to send verification email';
    let errorCode = 'EMAIL_SERVICE_ERROR';
    let originalError = 'Unknown error';
    
    if (error && typeof error === 'object') {
      const err = error as Record<string, unknown>;
      
      if (err.code === 'EAUTH') {
        errorMessage = 'Email authentication failed. Please check your SMTP credentials. Make sure you are using an App Password for Gmail.';
        errorCode = 'EMAIL_AUTH_ERROR';
      } else if (err.code === 'ECONNECTION') {
        errorMessage = 'Failed to connect to email server. Please check your SMTP settings.';
        errorCode = 'EMAIL_CONNECTION_ERROR';
      } else if (err.responseCode === 535) {
        errorMessage = 'Gmail authentication failed. Please use an App Password instead of your regular password.';
        errorCode = 'GMAIL_AUTH_ERROR';
      }
      
      if (typeof err.message === 'string') {
        originalError = err.message;
      }
    }

    throw new GraphQLError(errorMessage, {
      extensions: {
        code: errorCode,
        originalError
      }
    });
  }
};