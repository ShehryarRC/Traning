import { TypeOrmModule } from '@nestjs/typeorm';
import {Post} from './src/post/entities/post.entity';
import * as dotenv from 'dotenv';
import { Users } from './src/users/entities/users.entity';

dotenv.config();

export const TestDatabaseModule =  TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: [Post, Users], 
    database: process.env.DB_NAME,
    autoLoadEntities: true, 
    synchronize: process.env.DB_SYNCHRONIZE === 'true', 
  });