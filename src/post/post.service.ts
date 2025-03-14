import { Injectable, Inject } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    @Inject('POST_REPOSITORY')
    private readonly postRepository: PostRepository,
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const post = await this.postRepository.create(createPostDto);
      return await this.postRepository.save(post);
    } catch (e) {
      return e;
    }
  }

  async findAll() {
    return await this.postRepository.find();
  }

  findOne(id: number) {
    return this.postRepository.findPostsWithAuthors(id);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postRepository.update(id, updatePostDto);
  }

  remove(id: number) {
    return this.postRepository.delete(id);
  }
}
