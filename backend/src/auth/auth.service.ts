import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { EmailService } from './email.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, 
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, username, password } = signupDto;

    // Check for existing user
    const existingEmail = await this.userService.findByEmail(email);
    const existingUsername = await this.userService.findByUsername(username);

    if (existingEmail || existingUsername) {
      throw new ConflictException('Email or Username already in use')
    }

    // Hash password in bcrypt not working
    const hashedPassword = await argon2.hash(password);

    // Create user
    const newUser = await this.userService.create({
      ...signupDto,
      password: hashedPassword
    });

    return newUser
  }

  async signIn(username: string, password: string, response: Response) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
        throw new UnauthorizedException('Invalid credentials');
    }
    
    if (! await argon2.verify(user.password, password)) {
        throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { sub: user._id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    response.cookie('access_token', accessToken, {httpOnly: true})
    return user;
  }

  async logout(response: Response) {
    response.clearCookie('access_token');
  }

  async validateOAuthUser(oauthUser: any) {
    const { provider, providerId, email, username, first_name, last_name, avatar } = oauthUser;
    
    // Check if user exists by email first
    let user = await this.userService.findByEmail(email);
    
    if (!user) {
      // Check if username exists and create a unique one if needed
      let uniqueUsername = username;
      let counter = 1;
      while (await this.userService.findByUsername(uniqueUsername)) {
        uniqueUsername = `${username}_${counter}`;
        counter++;
      }

      // Create new user for OAuth
      user = await this.userService.create({
        username: uniqueUsername,
        email,
        first_name,
        last_name,
        password: await argon2.hash(`oauth_${provider}_${providerId}_${Date.now()}`), // Random password for OAuth users
        avatar, // Store the Google avatar URL directly - we trust Google's CDN
      });
    } else if (user.avatar !== avatar && avatar && avatar.includes('googleusercontent.com')) {
      // Update the avatar if it's different and it's from Google (user might have updated their Google avatar)
      await this.userService.update(user._id.toString(), { avatar });
      user.avatar = avatar;
    }

    return user;
  }

  async oauthLogin(user: any, response: Response) {
    const payload = { sub: user._id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    response.cookie('access_token', accessToken, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    return user;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'email does not exists' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to user
    await this.userService.updateResetToken(user._id.toString(), resetToken, resetExpires);

    // Send email
    try {
      await this.emailService.sendPasswordResetEmail(user.email, resetToken, user.username);
    } catch (error) {
      console.error('Failed to send reset email:', error);
      throw new BadRequestException('Failed to send reset email');
    }

    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;
    
    const user = await this.userService.findByResetToken(token);
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await argon2.hash(password);

    // Update user password and clear reset token
    await this.userService.updatePasswordAndClearToken(user._id.toString(), hashedPassword);

    return { message: 'Password has been reset successfully' };
  }
}
