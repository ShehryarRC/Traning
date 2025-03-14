import { DataSource } from 'typeorm';
import { Customers } from './src/customer/entities/customer.entity';

export const dataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1', // MySQL host
  port: 3306, // Default MySQL port
  username: 'root',
  password: '',
  database: 'todo',
  entities: [Customers],
  migrations: ['src/migrations/**/*.ts'],
  synchronize: false,
});
