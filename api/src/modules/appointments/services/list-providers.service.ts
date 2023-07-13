import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';

interface IRequest {
  user_id: string;
}
@Injectable()
export class ListProvidersService {
  constructor(private usersRepository: UsersRepository) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    const users = await this.usersRepository.findAllProviders({
      except_user_id: user_id,
    });

    return users;
  }
}
