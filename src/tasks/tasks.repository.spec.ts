import { Test, TestingModule } from '@nestjs/testing';
import { TasksRepository } from './tasks.repository';
import { DataSource, Repository } from 'typeorm';
import { Task } from './entities/task.entity';

const mockTaskRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

describe('TasksRepository', () => {
  let tasksRepository: TasksRepository;
  let mockDataSource: Partial<DataSource>;
  let mockFind: jest.Mock;

  beforeEach(async () => {
    mockFind = jest.fn();
    // Mock the DataSource and Repository
    mockDataSource = {
      createEntityManager: jest.fn().mockReturnValue({
        find: mockFind,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksRepository,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    tasksRepository = module.get<TasksRepository>(TasksRepository);
  });

  it('should be defined', () => {
    expect(tasksRepository).toBeDefined();
  });

  describe('findTasksByUserId', () => {
    it('should call createQueryBuilder with the correct parameters and return tasks', async () => {
      const userId = 1;
      const mockTasks = [{ id: 1, title: 'Task 1' }, { id: 2, title: 'Task 2' }];
      
      // Mocking the response of getMany
      mockTaskRepository.getMany.mockResolvedValue(mockTasks);

      // Call the method to test
      const result = await tasksRepository.findTasksByUserId(userId);

      // Asserting that the query builder methods were called with the expected arguments
      expect(mockTaskRepository.createQueryBuilder).toHaveBeenCalledWith('task');
      expect(mockTaskRepository.where).toHaveBeenCalledWith(
        'JSON_CONTAINS(task.assigned_to, :userId)',
        { userId: JSON.stringify(userId) },
      );
      expect(mockTaskRepository.getMany).toHaveBeenCalled();

      // Asserting the result of the function
      expect(result).toEqual(mockTasks);
    });

    it('should return an empty array if no tasks are found', async () => {
      const userId = 1;

      // Mocking the response of getMany to return an empty array
      mockTaskRepository.getMany.mockResolvedValue([]);

      const result = await tasksRepository.findTasksByUserId(userId);

      // Asserting the result is an empty array
      expect(result).toEqual([]);
    });
  });

});
