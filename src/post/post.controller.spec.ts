import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostController', () => {
  let controller: PostController;
  let mockPostService;

  beforeEach(async () => {
    mockPostService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService],
    })
      .overrideProvider(PostService)
      .useValue(mockPostService)
      .compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'This is a test post',
        authorId: 1,
      };
      const createdPost = { id: 1, ...createPostDto };
      mockPostService.create.mockResolvedValue(createdPost);
      const result = await controller.create(createPostDto);
      expect(mockPostService.create).toHaveBeenCalledWith(createPostDto);
      expect(result).toEqual(createdPost);
    });
  });

  describe('findAll', () => {
    it('should find all the records', async () => {
      const posts = [
        { id: 1, title: 'Test Post 1', content: 'Content 1', authorId: 1 },
        { id: 2, title: 'Test Post 2', content: 'Content 2', authorId: 2 },
      ];

      mockPostService.findAll.mockResolvedValue(posts);
      const res = await controller.findAll();
      expect(mockPostService.findAll).toHaveBeenCalled();
      expect(res).toEqual(posts);
    });
  });

  describe('findOne', () => {
    it('should find one record for the particular authorid', async () => {
      const authorId = 1;
      const post = {
        id: 1,
        title: 'Test Post',
        content: 'Test Content',
        author: { id: authorId, name: 'John Doe' },
      };

      mockPostService.findOne.mockResolvedValue(post);
      const res = await controller.findOne(authorId);

      expect(mockPostService.findOne).toHaveBeenCalledWith(authorId);
      expect(res).toBe(post);
    });
  });

  describe('update', () => {
    it('should update the records with particular id', async () => {
      const postId = '1';
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };
      const updateResult = { affected: 1 };
      mockPostService.update.mockResolvedValue(updateResult);

      const result = await controller.update(postId, updatePostDto);

      expect(mockPostService.update).toHaveBeenCalledWith(
        +postId,
        updatePostDto,
      );
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove the post with the given id', async () => {
      const postId = '1';
      const deleteResult = { affected: 1 };
      mockPostService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove(postId);

      expect(mockPostService.remove).toHaveBeenCalledWith(+postId);
      expect(result).toEqual(deleteResult);
    });
  });
});
