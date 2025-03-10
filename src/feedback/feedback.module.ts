import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { FeedbackRepository } from './feedback.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback])],
  controllers: [FeedbackController],
  providers: [
    FeedbackService,
    {
      provide: 'FEEDBACK_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        new FeedbackRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: ['FEEDBACK_REPOSITORY'],
})
export class FeedbackModule {}
