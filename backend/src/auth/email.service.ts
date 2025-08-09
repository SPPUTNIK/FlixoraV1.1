import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailConstants } from './constants';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConstants.host,
      port: emailConstants.port,
      secure: emailConstants.secure,
      auth: {
        user: emailConstants.user,
        pass: emailConstants.pass,
      },
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string, username: string) {
    const frontendUrl = process.env.FRONTEND_URL;
    console.log('Reset token:', resetToken);
    const resetUrl = `${frontendUrl}auth/reset-password?token=${resetToken}`;

    console.log('Reset URL:', resetUrl);
    const mailOptions = {
      from: emailConstants.from,
      to: email,
      subject: 'Password Reset - HyperTube',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>Hello ${username},</p>
          <p>You requested a password reset for your HyperTube account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent to:', email);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}