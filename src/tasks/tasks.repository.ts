import { Repository, DataSource } from 'typeorm';
import { Task } from './entities/task.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async findTasksByUserId(userId: number) {
    return this.createQueryBuilder('task')
      .where('JSON_CONTAINS(task.assigned_to, :userId)', {
        userId: JSON.stringify(userId),
      })
      .getMany();
  }

  async findTasksByStatus(status: string) {
    return this.find({ where: { status } });
  }
}
