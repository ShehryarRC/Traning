import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackRepository } from './feedback.repository';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
  private logger = new Logger();

  constructor(
    @Inject('FEEDBACK_REPOSITORY')
    private readonly feedbackRepository: FeedbackRepository,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    try {
      const feedback = await this.feedbackRepository.create(createFeedbackDto);
      return this.feedbackRepository.save(feedback);
    } catch (err) {
      if (err.code == 23505) {
        this.logger.error(err.message, err.stack);
        throw new HttpException('Customer already exists', HttpStatus.CONFLICT);
      }
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }

  async findAll(): Promise<Feedback[]> {
    try {
      return await this.feedbackRepository.find();
    } catch (err) {
      this.logger.error(
        `Failed to retrieve feedbacks: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve feedbacks. Please try again later.',
      );
    }
  }

  async findOne(id: number): Promise<Feedback[]> {
    try {
      const feedbacks = await this.feedbackRepository.find({
        where: { customerId: id },
      });

      if (feedbacks.length === 0) {
        throw new NotFoundException(
          `No feedback found for customer with ID ${id}`,
        );
      }

      return feedbacks;
    } catch (err) {
      this.logger.error(
        `Failed to retrieve feedback for customer ${id}: ${err.message}`,
        err.stack,
      );

      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new InternalServerErrorException(
        'Failed to retrieve feedback. Please try again later.',
      );
    }
  }

  async getRatings(): Promise<any> {
    try {
      return await this.feedbackRepository.getRatings();
    } catch (err) {
      this.logger.error(
        `Failed to retrieve ratings: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve ratings. Please try again later.',
      );
    }
  }
}
