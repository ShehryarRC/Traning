import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASKS_REPOSITORY')
    private readonly tasksRepository: TasksRepository,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const task = this.tasksRepository.create(createTaskDto);
      return await this.tasksRepository.save(task);
    } catch (e) {
      return e;
    }
  }

  findAll() {
    return this.tasksRepository.find();
  }

  findTaskByUserId(id: number) {
    try {
      return this.tasksRepository.findTasksByUserId(id);
    } catch (e) {
      return e;
    }
  }

  findByStatus(status: string) {
    try {
      return this.tasksRepository.findTasksByStatus(status);
    } catch (e) {
      return e;
    }
  }

  async updateTask(id: number, updateTask: UpdateTaskDto) {
    try {
      const task = await this.tasksRepository.findOne({ where: { id } });
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found.`);
      }
      Object.assign(task, updateTask);
      return await this.tasksRepository.save(task);
    } catch (e) {
      return e;
    }
  }
}
