import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';

describe('Post Module (E2E)', () => {
  let app: INestApplication;
  let dbConnection: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dbConnection = moduleFixture.get(DataSource);
  });

  afterEach(async () => {
    await dbConnection.query('DELETE FROM post');
    await dbConnection.query('DELETE FROM users');
  });

  afterAll(async () => {
    await dbConnection.destroy();
    await app.close(); 
  });



it('should create a post', async () => {
    const userResponse = await request(app.getHttpServer())
      .post('/users/')
      .send({ name: 'John Doe', email: 'john@example.com' })
      .expect(201);
  
    const userId = userResponse.body.id;
  
    const response = await request(app.getHttpServer())
      .post('/post/')
      .send({
        title: 'Test Post',
        content: 'This is a test post',
        authorId: userId, 
      })
      .expect(201);
  
    expect(response.body.id).toBeDefined();
    expect(response.body.title).toBe('Test Post');
    expect(response.body.content).toBe('This is a test post');
    expect(response.body.authorId).toBe(userId);
  });

  it('should get all posts', async () => {
    const userResponse =  await request(app.getHttpServer()).post('/users').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    const userId = userResponse.body.id;

     await request(app.getHttpServer()).post('/post/').send({
      title: 'First Post',
      content: 'This is the first post',
      authorId: userId,
    });
  
    const response = await request(app.getHttpServer()).get('/post/').expect(200);
  
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].title).toBe('First Post');
  });

  it('should get a single post by ID', async () => {
    const userResponse = await request(app.getHttpServer())
      .post('/users/')
      .send({ name: 'John Doe', email: 'john@example.com' })
      .expect(201);
  
    const userId = userResponse.body.id;

    const postResponse = await request(app.getHttpServer()).post('/post').send({
      title: 'Single Post',
      content: 'This post should be fetched individually',
      authorId: userId,
    });
  
    const postId = postResponse.body.id;
  
    const response = await request(app.getHttpServer()).get(`/post/${userId}`).expect(200);  
    expect(response.body[0].id).toBe(postId);
    expect(response.body[0].title).toBe('Single Post');
  });


  it('should update a post', async () => {
    const userResponse = await request(app.getHttpServer())
    .post('/users/')
    .send({ name: 'John Doe', email: 'john@example.com' })
    .expect(201);

  const userId = userResponse.body.id;

    const postResponse = await request(app.getHttpServer()).post('/post').send({
      title: 'Old Title',
      content: 'Old content',
      authorId: userId,
    });
  
    const postId = postResponse.body.id;
  
    const response = await request(app.getHttpServer()).patch(`/post/${postId}`).send({
      title: 'Updated Title',
    });
  
    expect(response.body.affected).toBe(1);
  });

  it('should delete a post', async () => {
    const userResponse = await request(app.getHttpServer())
    .post('/users/')
    .send({ name: 'John Doe', email: 'john@example.com' })
    .expect(201);

  const userId = userResponse.body.id;

    const postResponse = await request(app.getHttpServer()).post('/post').send({
      title: 'To be deleted',
      content: 'This post will be deleted',
      authorId: userId,
    });
  
    const postId = postResponse.body.id;
  
    await request(app.getHttpServer()).delete(`/post/${postId}`).expect(200);
  });
  
});