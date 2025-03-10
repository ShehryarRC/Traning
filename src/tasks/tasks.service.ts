import { Injectable, Inject } from '@nestjs/common';
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
    try{
      const task = this.tasksRepository.create(createTaskDto); // Create instance
      return await this.tasksRepository.save(task); 
    }catch(e){
      return e;
    }
  }

  findAll() {
    return this.tasksRepository.find();
  }

  findTaskByUserId(id: number) {
    return this.tasksRepository.findTasksByUserId(id);
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
