import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from './customer.repository';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customers } from './entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customers])],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: 'CUSTOMER_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        new CustomerRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: ['CUSTOMER_REPOSITORY'],
})
export class CustomerModule {}
