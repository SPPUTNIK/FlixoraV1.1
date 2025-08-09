import { Controller, Get, Post, Req, UseGuards, UseInterceptors, Body, UploadedFiles, Request, Put, Param, NotFoundException, Patch, UnauthorizedException} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiConflictResponse, ApiInternalServerErrorResponse} from '@nestjs/swagger';
import { GetUsersDto } from './dto/get-users.dto';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  // @UseGuards(AuthGuard)
  @ApiOperation({summary: "Get Uses API"})
  @ApiOkResponse({description: "get a list of users [id, username]"})
  async getAllUsers(): Promise<GetUsersDto[]> {
    const users = await this.userService.findAll();
    return  users.map(user => ({
      id: user._id,
      username: user.username,
      avatar: user.avatar
    }))
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Get Uses API, This Api is Just for the Admin"})
  @ApiCreatedResponse({description: "[username, email, avatar]"})
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {  username: user.username,
             email: user.email,
             avatar: user.avatar}
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Update User Profile Informations [first_name, last_name, username, email, password, avatar, andbackground]"})
  @ApiOkResponse({description: "User Infos Updated Successfully"})
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'background', maxCount: 1 },
    ]),
  )
  async updateUser(
    @Param('id') id: string,
    @UploadedFiles() files: { avatar?: any, background?: any },
    @Body() userData: UpdateUserDto,
    @Request() req,
  ) {
  
    const userId = req.user.sub
    if (userId != id) {
      throw new UnauthorizedException()
    }
    const avatar = files && files.avatar && files.avatar.length > 0 ? files.avatar[0].filename : null;
    const background = files && files.background && files.background.length > 0 ? files.background[0].filename : null;
    await this.userService.updateUser({
      ...userData,
      avatar: avatar,
      background: background,
      id: userId
    });
 
    return {
      message: 'User Infos Updated Successfully',
    };
  }

  @Patch('language')
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Update User Language"})
  @ApiOkResponse({description: "language"})
  async updateLanguage(
    @Req() req: any,
    @Body() dto: UpdateLanguageDto,
  ) {
  
    const id = req.user.sub;
    return this.userService.updateLanguage(id, dto);
  }

}
