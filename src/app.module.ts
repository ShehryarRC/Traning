import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CustomerModule } from './customer/customer.module';
import { FeedbackModule } from './feedback/feedback.module';
import { TasksModule } from './tasks/tasks.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Inject Global Config file
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true, // Add all entities automatically
      synchronize: process.env.DB_SYNCHRONIZE === 'true', // Auto sync DB schema (disable in production)
    }),
    UsersModule,
    CustomerModule,
    FeedbackModule,
    TasksModule,
  ],
})
export class AppModule {}
