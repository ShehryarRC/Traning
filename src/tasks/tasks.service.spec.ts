import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { TasksRepository } from './tasks.repository';

describe('TasksService', () => {
  let service: TasksService;
  let mockFind: jest.Mock;

  beforeEach(async () => {
    mockFind = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).overrideProvider(TasksRepository).useValue({}).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createtasks', () => {
    it('should return posts with the given author ID', async () => {
      const mockPosts: Task[] = [
        { id: 1, title: 'Post 1', description: 'Content 1', status: 'pending' } as Task,
        { id: 2, title: 'Post 2', description: 'Content 2', status: 'pending' } as Task,
      ]

      mockFind.mockResolvedValue(mockPosts);

    
    });
})
});
