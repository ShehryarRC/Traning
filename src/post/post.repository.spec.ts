import { Test, TestingModule } from '@nestjs/testing';
import { PostRepository } from './post.repository';
import { DataSource, Repository } from 'typeorm';
import { Post } from './entities/post.entity';

describe('PostRepository', () => {
  let postRepository: PostRepository;
  let mockDataSource: Partial<DataSource>;
  let mockFind: jest.Mock;

  beforeEach(async () => {
    mockFind = jest.fn();

    // Mock the DataSource and Repository
    mockDataSource = {
      createEntityManager: jest.fn().mockReturnValue({
        find: mockFind,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostRepository,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    postRepository = module.get<PostRepository>(PostRepository);
  });

  it('should be defined', () => {
    expect(postRepository).toBeDefined();
  });

  describe('findPostsWithAuthors', () => {
    it('should return posts with the given author ID', async () => {
      const mockPosts: Post[] = [
        {
          id: 1,
          title: 'Post 1',
          content: 'Content 1',
          author: { id: 1 },
        } as Post,
        {
          id: 2,
          title: 'Post 2',
          content: 'Content 2',
          author: { id: 1 },
        } as Post,
      ];

      mockFind.mockResolvedValue(mockPosts);

      const result = await postRepository.findPostsWithAuthors(1);
      expect(result).toEqual(mockPosts);
      expect(mockFind).toHaveBeenCalledWith({
        where: { author: { id: 1 } },
        relations: ['author'],
      });
    });

    it('should return an empty array if no posts are found', async () => {
      mockFind.mockResolvedValue([]);

      const result = await postRepository.findPostsWithAuthors(2);
      expect(result).toEqual([]);
      expect(mockFind).toHaveBeenCalledWith({
        where: { author: { id: 2 } },
        relations: ['author'],
      });
    });
  });
});
