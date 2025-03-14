import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TestDatabaseModule } from '../../test-database.module';
import { PostRepository } from './post.repository';
import { Post } from './entities/post.entity';
import { Users } from '../users/entities/users.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
class PostRepositoryTest extends PostRepository {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
}

describe('PostRepository (Integration Test)', () => {
  let module: TestingModule;
  let postRepository: PostRepositoryTest;
  let dbRepo: Repository<Post>;
  let userRepo: Repository<Users>;

  // connected the test database and included the repository needed for testing the repository I am testing.
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestDatabaseModule, TypeOrmModule.forFeature([Post, Users])],
      providers: [PostRepositoryTest],
    }).compile();

    postRepository = module.get(PostRepositoryTest);
    dbRepo = module.get(DataSource).getRepository(Post);
    userRepo = module.get(DataSource).getRepository(Users);
  });

  afterEach(async () => {
    await dbRepo.createQueryBuilder().delete().execute();
    await userRepo.createQueryBuilder().delete().execute();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should save and retrieve posts with an author', async () => {
    const testUser = userRepo.create({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    });

    await userRepo.save(testUser);

    const testPost = dbRepo.create({
      title: 'Test Post',
      content: 'This is a test',
      author: testUser,
    });

    await dbRepo.save(testPost);

    const result = await postRepository.findPostsWithAuthors(1);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Test Post');
    expect(result[0].author.id).toBe(1);
  });
});
