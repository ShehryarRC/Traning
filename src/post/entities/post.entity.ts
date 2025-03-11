import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Users } from 'src/users/users.entity';
  
  @Entity()
  export class Post {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column()
    content: string;

    @Column()
    authorId: number;
  
    @ManyToOne(() => Users, (user) => user.posts, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'authorId' })
    author: Users;
  }
  