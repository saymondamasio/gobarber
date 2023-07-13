import { ApiFile } from '@modules/shared/decorators/api-file.decorator';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CreateUserService } from '../services/create-user.service';
import { UpdateUserAvatarService } from '../services/update-user-avatar.service';
import { CreateUserDTO } from './dtos/create-user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private createUserService: CreateUserService,
    private updateUserAvatarService: UpdateUserAvatarService,
  ) {}

  @Post()
  @ApiBody({ type: CreateUserDTO })
  async create(@Body() createUserDTO: CreateUserDTO) {
    return this.createUserService.execute(createUserDTO);
  }

  @Patch('avatar')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiFile('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.updateUserAvatarService.execute({
      avatarFilename: file.filename,
      user_id: req.user.id,
    });
  }
}
