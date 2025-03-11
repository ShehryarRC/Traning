import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Task } from './entities/task.entity';
import { DataSource } from 'typeorm';

describe('TasksController with Real Database', () => {
  let controller: TasksController;
  let service: TasksService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '3306'),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          autoLoadEntities: true, // Add all entities automatically
          synchronize: process.env.DB_SYNCHRONIZE === 'true', //   // Sync your database schema automatically
        }),
        TypeOrmModule.forFeature([TasksRepository]), // Import your repository here
      ],
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      // Insert a sample task into the database
      const task = new Task();
      task.title = 'Test Task';
      task.status = 'pending';
      await dataSource.getRepository(Task).save(task);

      const result = await controller.findAll(); // Call controller's findAll method
      expect(result).toEqual([task]); // Expect the result to match the inserted task
    });
  });

  describe('findTaskByUserId', () => {
    it('should return tasks assigned to a user', async () => {
      // Insert a sample task assigned to a user
      const task = new Task();
      task.title = 'Task for User';
      task.status = 'pending';
      task.assigned_to = [1]; // Assuming 'assigned_to' is an array
      await dataSource.getRepository(Task).save(task);

      const tasks = await controller.findTaskByUserId('1'); // Call controller's findTaskByUserId with string ID
      expect(tasks).toEqual([task]); // Expect the result to match the inserted task
    });
  });

  afterAll(async () => {
    // Close the connection after all tests are done
    await dataSource.destroy();
  });
});
