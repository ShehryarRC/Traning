import { UsersRepository } from '../../src/users/users.repository';
import { Repository } from 'typeorm';
import { Users } from '../../src/users/users.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

class MockUsers {
  create() {
    return { id: 2, username: 'mustafa', email: 'mustafa@gmail.com' };
  }
  findOne() {
    return Promise.resolve({
      id: 2,
      username: 'mustafa',
      email: 'mustafa@gmail.com',
    });
  }
  save() {
    return Promise.resolve({
      id: 2,
      username: 'mustafa',
      email: 'mustafa@gmail.com',
    });
  }
}

describe('UserRepository', () => {
  let usersRepository: UsersRepository;
  let mockRepository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getRepositoryToken(Users),
          useClass: MockUsers,
        },
      ],
    }).compile();
    usersRepository = module.get<UsersRepository>(UsersRepository);
    mockRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(usersRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user = await usersRepository.create({
        name: 'mustafa',
        email: 'mustafa@gmail.com',
      });
      expect(user).toEqual({
        id: 1,
        username: 'mustafa',
        email: 'mustafa@gmail.com',
      });
    });
  });
  describe('findOne', () => {
    it('should find a user', async () => {
      const user = await usersRepository.findByEmail('mustafa@gmail.com');
      expect(user).toEqual({
        id: 1,
        username: 'mustafa',
        email: 'mustafa@gmail.com',
      });
    });
    it('should not find a user', async () => {
      jest.spyOn(mockRepository, 'findOne').mockResolvedValue(null);
      const user = await usersRepository.findByEmail('basel@gmail.com');
      expect(user).toEqual(null);
    });
  });
});
