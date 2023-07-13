import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { storageConfig } from 'src/config/storage';
import { SharedModule } from 'src/modules/shared/shared.module';
import { MailModule } from '../mail/mail.module';
import { PasswordController } from './controllers/password.controller';
import { ProfileController } from './controllers/profile.controller';
import { UsersController } from './controllers/users.controller';
import { UserTokensRepository } from './repositories/user-tokens.repository';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserService } from './services/create-user.service';
import { FindUserByEmailService } from './services/find-user-by-email.service';
import { ResetPasswordService } from './services/reset-password.service';
import { SendForgotPasswordEmailService } from './services/send-forgot-password-email.service';
import { ShowProfileService } from './services/show-profile.service';
import { UpdateProfileService } from './services/update-profile.service';
import { UpdateUserAvatarService } from './services/update-user-avatar.service';

@Module({
  imports: [
    MailModule,
    SharedModule,
    TypeOrmModule.forFeature([UsersRepository, UserTokensRepository]),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: storageConfig.upload.multer.storage,
      }),
    }),
  ],
  controllers: [UsersController, ProfileController, PasswordController],
  providers: [
    FindUserByEmailService,
    CreateUserService,
    ShowProfileService,
    UpdateProfileService,
    UpdateUserAvatarService,
    ResetPasswordService,
    SendForgotPasswordEmailService,
  ],
  exports: [FindUserByEmailService],
})
export class UsersModule {}
