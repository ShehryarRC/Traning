import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostRepository } from './post.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [
    PostService,
    {
      provide: 'POST_REPOSITORY',
      useFactory: (dataSource: DataSource) => new PostRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: ['POST_REPOSITORY'],
})
export class PostModule {}
