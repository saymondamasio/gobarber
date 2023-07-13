import { IDateProvider } from '@modules/shared/providers/DateProvider/models/date.provider';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/modules/mail/mail.service';
import { AppError } from 'src/modules/shared/errors/AppError';
import { UserTokensRepository } from '../repositories/user-tokens.repository';
import { UsersRepository } from '../repositories/users.repository';

interface IRequest {
  email: string;
}

@Injectable()
export class SendForgotPasswordEmailService {
  constructor(
    private usersRepository: UsersRepository,
    private userTokensRepository: UserTokensRepository,
    private mailService: MailService,
    private config: ConfigService,
    @Inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const expires_at = this.dateProvider.addHours(
      this.config.get<number>('MAIL_EXPIRATION_HOURS'),
    );

    const userToken = this.userTokensRepository.create({
      user_id: user.id,
      expires_at,
    });

    const { token } = await this.userTokensRepository.save(userToken);

    await this.mailService.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Recuperação de senha',
      context: {
        name: user.name,
        link: `${this.config.get('APP_WEB_URL')}/reset-password?token=${token}`,
      },
    });
  }
}
