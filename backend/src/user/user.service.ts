import { Injectable, InternalServerErrorException, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import * as argon2 from 'argon2'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<HydratedDocument<User>>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findOne({ _id: userId });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async updateUser(userData: UpdateUserDto): Promise<User | null> {
    const user = await this.userModel.findById(userData.id);
    if (! user) {
      throw new InternalServerErrorException();
    }
    const checkEmail = await this.userModel.findOne({email: userData.email});
    const checkUsername = await this.userModel.findOne({username: userData.username});

    if (checkEmail || checkUsername) {
      throw new UnauthorizedException("Username or Email already Existed");
    }

    const hashedPassword =  await argon2.hash(userData.password); 
    const updateUser = await this.userModel.findByIdAndUpdate(userData.id, {
      username: userData.username || user.username,
      first_name: userData.first_name || user.first_name,
      last_name: userData.last_name || user.last_name,
      email: userData.email || user.email,
      password: hashedPassword || user.password,
      avatar: userData.avatar || user.avatar,
      background: userData.background || user.avatar,
    }, { new: true });
    console.log("updatedUser = ", updateUser);
    return updateUser
  }

  async update(id: string, updateUserDto: Partial<UpdateUserDto>): Promise<User | null> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id, 
        updateUserDto, 
        { new: true }
      );
      
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      
      return updatedUser;
    } catch (error) {
      console.log('Update error:', error); // Debug log
      
      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0]; // Get the field that caused the duplicate error
        const value = error.keyValue[field]; // Get the value that caused the duplicate
        
        if (field === 'email') {
          throw new ConflictException(`Email '${value}' is already in use`);
        } else if (field === 'username') {
          throw new ConflictException(`Username '${value}' is already taken`);
        } else {
          throw new ConflictException(`${field} '${value}' already exists`);
        }
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  async updatePassword(userId: string, newPassword: string): Promise<User | null> {
    const hashedPassword = await argon2.hash(newPassword);
    
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async updateLanguage(userId: string, dto: UpdateLanguageDto) {
    return this.userModel.findByIdAndUpdate(userId, { language: dto.language }, { new: true });
  }

  async updateResetToken(userId: string, resetToken: string, resetExpires: Date): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userModel.findOne({ resetPasswordToken: token });
  }

  async updatePasswordAndClearToken(userId: string, hashedPassword: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      $unset: {
        resetPasswordToken: 1,
        resetPasswordExpires: 1,
      },
    });
  }
}
