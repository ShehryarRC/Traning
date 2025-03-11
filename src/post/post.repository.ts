import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  async findPostsWithAuthors(authorId:number): Promise<Post[]> {
    return this.find({
        where: { author: { id: authorId } }, // Filtering by author ID
      relations: ['author'], // Fetch the related User entity
    });
  }
}
