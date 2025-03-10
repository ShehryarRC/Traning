import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Customers } from './entities/customer.entity';

@Injectable()
export class CustomerRepository extends Repository<Customers> {
  constructor(private dataSource: DataSource) {
    super(Customers, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<Customers | null> {
    return this.findOne({ where: { email } });
  }
}
