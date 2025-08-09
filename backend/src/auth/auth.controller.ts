import { Body, Controller, Post, BadRequestException, UnauthorizedException, Res, UseGuards, InternalServerErrorException, HttpCode, HttpStatus, Get, Req, NotFoundException, Patch, ConflictException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { Response, Request } from 'express';
import { AuthGuard } from './auth.guard';
import { SigninDto } from './dto/signin.dto';
import { FortyTwoAuthGuard } from './guards/fortytwo-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard'; // Add this import
import {ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiConflictResponse, ApiInternalServerErrorResponse} from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UpdateCurrentUserDto } from './dto/update-current-user.dto'; // Add this import
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({summary: "Singup API"})
  @ApiCreatedResponse({description: "User Created Successfully"})
  @ApiConflictResponse({description: "Email or Username already in use"})
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async signup(@Body() signupDto: SignupDto,  @Res({ passthrough: true }) response: Response) {
  
    const user = await this.authService.signup(signupDto);
    if (user) {
      return {message: "user created successfully"};
    }
    throw new InternalServerErrorException();
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: "Singin API"})
  @ApiOkResponse({description: "LoggedIn Successfully"})
  @ApiUnauthorizedResponse({description: "Invalid credentials"})
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async signIn(@Body() signinDto: SigninDto, @Res({ passthrough: true }) response: Response) {
    const user = await this.authService.signIn(signinDto.username, signinDto.password, response);
    if (user) {
      return { message: 'LoggedIn Successfully' };
    }
    throw new InternalServerErrorException();
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: "Only authenticated users can access this Logout API"})
  @ApiOkResponse({description: "LoggedOut Successfully"})
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async logout(@Res({ passthrough: true }) response: Response) {
    this.authService.logout(response);
    return {message: "LogedOut Successfully"};
  }

  // Google OAuth Routes - Now enabled
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() response: Response) {
    try {
      console.log('=== Google Callback Started ===');
      console.log('Request query:', req.query);
      console.log('Request user:', req.user);
      
      if (!req.user) {
        console.error('No user found in request');
        return response.redirect(`${process.env.FRONTEND_URL}/auth/login?error=no_user`);
      }
      
      const user = await this.authService.validateOAuthUser(req.user);
      console.log('Validated OAuth user:', user);
      
      await this.authService.oauthLogin(user, response);
      console.log('OAuth login successful, redirecting...');
      
      return response.redirect(`${process.env.FRONTEND_URL}/library`);
    } catch (error) {
      console.error('=== Google OAuth Callback Error ===');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      return response.redirect(`${process.env.FRONTEND_URL}/auth/login?error=oauth_failed`);
    }
  }

  // 42 Intra OAuth Routes
  @Get('42')
  @UseGuards(FortyTwoAuthGuard)
  async fortyTwoAuth() {
    // Initiates 42 OAuth flow
  }

  @Get('42/callback')
  @UseGuards(FortyTwoAuthGuard)
  async fortyTwoAuthCallback(@Req() req: Request, @Res() response: Response) {
    try {
      console.log('=== 42 Callback Started ===');
      console.log('Request query:', req.query);
      console.log('Request user:', req.user);
      
      if (!req.user) {
        console.error('No user found in request');
        return response.redirect(`${process.env.FRONTEND_URL}/auth/login?error=no_user`);
      }
      
      const user = await this.authService.validateOAuthUser(req.user);
      console.log('Validated OAuth user:', user);
      
      await this.authService.oauthLogin(user, response);
      console.log('OAuth login successful, redirecting...');
      
      return response.redirect(`${process.env.FRONTEND_URL}/library`);
    } catch (error) {
      console.error('=== 42 OAuth Callback Error ===');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      return response.redirect(`${process.env.FRONTEND_URL}/auth/login?error=oauth_failed`);
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Get Current User Information"})
  @ApiOkResponse({description: "Current user data"})
  @ApiUnauthorizedResponse({description: "User not authenticated"})
  async getCurrentUser(@Req() req: any) {
    const userId = req.user.sub; // Extract user ID from JWT payload
    const user = await this.userService.findById(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      first_name: user.first_name,
      last_name: user.last_name,
      language: user.language
    };
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar')) // Add this interceptor
  @ApiOperation({summary: "Update Current User Profile (excluding password)"})
  @ApiOkResponse({description: "Profile updated successfully"})
  @ApiUnauthorizedResponse({description: "User not authenticated"})
  @ApiBadRequestResponse({description: "No fields to update"})
  @ApiConflictResponse({description: "Email or username already exists"})
  async updateCurrentUser(
    @Req() req: any,
    @Body() updateCurrentUserDto: UpdateCurrentUserDto,
    @UploadedFile() avatarFile?: Express.Multer.File // Add this parameter
  ) {
    const userId = req.user.sub;
    
    // Handle avatar file upload
    if (avatarFile) {
      updateCurrentUserDto.avatar = `uploads/${avatarFile.filename}`;
      console.log('Avatar file uploaded:', updateCurrentUserDto.avatar);
    }
    
    // Check if there are fields to update
    const updateData = Object.keys(updateCurrentUserDto).reduce((acc, key) => {
      if (updateCurrentUserDto[key] !== undefined && updateCurrentUserDto[key] !== null) {
        acc[key] = updateCurrentUserDto[key];
      }
      return acc;
    }, {});
    
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No fields to update');
    }
    
    console.log('Updating user with data:', updateData);
    
    try {
      const updatedUser = await this.userService.update(userId, updateData);
      
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      
      return {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        language: updatedUser.language
      };
    } catch (error) {
      console.log('Controller error:', error);
      throw error;
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}

