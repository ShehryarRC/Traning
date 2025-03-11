import {
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './entities/users.entity';
import { UsersDto } from './dto/create-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private readonly usersRepository: UsersRepository,
  ) {}
  async create(name: string, email: string): Promise<Users> {
    const user = this.usersRepository.create({ name, email });
    return this.usersRepository.save(user);
  }
  async findOne(email: string): Promise<Users | null> {
    return this.usersRepository.findByEmail(email);
  }

  async update(id, userData: UsersDto) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      Object.assign(user, userData);
      return await this.usersRepository.save(user);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to update user. Please try again later.',
      );
    }
  }

  async deleteUser(id: number) {
    return this.usersRepository.delete(id);
  }
}
