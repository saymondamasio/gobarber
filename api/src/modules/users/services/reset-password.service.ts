import { IDateProvider } from '@modules/shared/providers/DateProvider/models/date.provider';
import { Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { AppError } from 'src/modules/shared/errors/AppError';
import { UserTokensRepository } from '../repositories/user-tokens.repository';
import { UsersRepository } from '../repositories/users.repository';

interface IRequest {
  password: string;
  token: string;
}

@Injectable()
export class ResetPasswordService {
  constructor(
    private usersRepository: UsersRepository,
    private userTokensRepository: UserTokensRepository,
    @Inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const isValid = this.dateProvider.compareIfBefore(
      userToken.expires_at,
      new Date(),
    );

    if (isValid) {
      throw new AppError('Token expired');
    }

    user.password = await hash(password, 8);

    await this.usersRepository.save(user);
  }
}
