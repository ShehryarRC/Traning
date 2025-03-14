import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostService', () => {
  let service: PostService;
  let mockPostRepository;

  beforeEach(async () => {
    mockPostRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findPostsWithAuthors: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: 'POST_REPOSITORY',
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'This is a test post',
        authorId: 1,
      };
      const createdPost = { id: 1, ...createPostDto };

      mockPostRepository.create.mockReturnValue(createdPost);
      mockPostRepository.save.mockResolvedValue(createdPost);

      const result = await service.create(createPostDto);

      expect(mockPostRepository.create).toHaveBeenCalledWith(createPostDto);
      expect(mockPostRepository.save).toHaveBeenCalledWith(createdPost);
      expect(result).toEqual(createdPost);
    });

    it('should return error when post creation fails', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'This is a test post',
        authorId: 1,
      };
      const error = new Error('Database error');

      mockPostRepository.create.mockImplementation(() => {
        throw error;
      });

      const result = await service.create(createPostDto);

      expect(mockPostRepository.create).toHaveBeenCalledWith(createPostDto);
      expect(mockPostRepository.save).not.toHaveBeenCalled();
      expect(result).toEqual(error);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = [
        { id: 1, title: 'Test Post 1', content: 'Content 1', authorId: 1 },
        { id: 2, title: 'Test Post 2', content: 'Content 2', authorId: 2 },
      ];
      mockPostRepository.find.mockResolvedValue(posts);

      const result = await service.findAll();

      expect(mockPostRepository.find).toHaveBeenCalled();
      expect(result).toEqual(posts);
    });
  });

  describe('findOne', () => {
    it('should return a single post with author details', async () => {
      const postId = 1;
      const post = {
        id: postId,
        title: 'Test Post',
        content: 'Test Content',
        author: { id: 1, name: 'John Doe' },
      };
      mockPostRepository.findPostsWithAuthors.mockResolvedValue(post);

      const result = await service.findOne(postId);

      expect(mockPostRepository.findPostsWithAuthors).toHaveBeenCalledWith(
        postId,
      );
      expect(result).toEqual(post);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const postId = 1;
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };
      const updateResult = { affected: 1 };
      mockPostRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(postId, updatePostDto);

      expect(mockPostRepository.update).toHaveBeenCalledWith(
        postId,
        updatePostDto,
      );
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should delete a post', async () => {
      const postId = 1;
      const deleteResult = { affected: 1 };
      mockPostRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(postId);

      expect(mockPostRepository.delete).toHaveBeenCalledWith(postId);
      expect(result).toEqual(deleteResult);
    });
  });
});