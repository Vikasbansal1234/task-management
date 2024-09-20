import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../../app.module';
import { Task } from '@app/domains/task/entities/task.entity';

describe('TaskController (e2e)', () => {
  let app: INestApplication;

  const mockTask: Task = {
    _id: 'task-id',
    title: 'Test Task',
    description: 'This is a test task',
    priority: 'Medium',
    status: 'To Do',
    deadline: new Date(),
  } as Task;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/tasks (POST) - should create a new task', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/tasks')
      .send({
        _id:"66e578cc9f2e2bca648b4f99",
        title: 'Test Task',
        description: 'This is a test task',
        priority: 'Medium',
        status: 'To Do',
        deadline: new Date(),
      })
      .expect(201);

    expect(response.body.title).toBe('Test Task');
  });

  it('/api/tasks/:id (GET) - should get a task by id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/tasks/66e578cc9f2e2bca648b4f99`)
      .expect(200);

    expect(response.body.title).toBe('Test Task');
  });

  it('/api/tasks (GET) - should get all tasks', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/tasks')
      .query({ limit: 10, page: 1 })
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/api/tasks/:id (PUT) - should update a task', async () => {
    const response = await request(app.getHttpServer())
      .put('/api/tasks/66e578cc9f2e2bca648b4f99')
      .send({
        title: 'Updated Task',
      })
      .expect(200);

    expect(response.body.title).toBe('Updated Task');
  });

  it('/api/tasks/:id (DELETE) - should delete a task', async () => {
    await request(app.getHttpServer())
      .delete(`/api/tasks/66e578cc9f2e2bca648b4f99`)
      .expect(200);
  });
});