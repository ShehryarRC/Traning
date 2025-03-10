import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackRepository extends Repository<Feedback> {
  constructor(private dataSource: DataSource) {
    super(Feedback, dataSource.createEntityManager());
  }

  async getRatings() {
    return await this.createQueryBuilder('feedback')
      .select('AVG(feedback.rating)', 'totalRating')
      .getRawOne();
  }
}
