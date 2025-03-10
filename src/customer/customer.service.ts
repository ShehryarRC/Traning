import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerRepository } from './customer.repository';
import { Customers } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  private logger = new Logger();

  constructor(
    @Inject('CUSTOMER_REPOSITORY')
    private readonly customerRepository: CustomerRepository,
  ) {}

  async createCustomer(createCustomer: CreateCustomerDto): Promise<Customers> {
    try {
      const user = await this.customerRepository.create(createCustomer);
      return await this.customerRepository.save(user);
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

  findAll() {
    return this.customerRepository.find();
  }

  async findOne(email: string) {
    try {
      const customer = await this.customerRepository.findByEmail(email);
      if (!customer) {
        return new HttpException('Customer Not Found', HttpStatus.NOT_FOUND);
      }
      return customer;
    } catch (err) {
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }
}
