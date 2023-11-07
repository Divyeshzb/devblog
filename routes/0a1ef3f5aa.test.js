// Test generated by RoostGPT for test nodetest-nov using AI Type Azure Open AI and AI Model roost-gpt4-32k

const request = require('supertest');
const app = require('../app');
const Post = require('../models/Post');
jest.mock('../models/Post');

describe('router get /', () => {
  beforeEach(async () => {
    Post.countDocuments.mockReset();
    Post.find.mockReset();
  });

  test('should return correct page data when page number is specified', async () => {
    Post.countDocuments.mockResolvedValue(100);
    Post.find.mockResolvedValue([...Array(10).keys()].map(i => ({ title: `post ${i + 1}` })));

    const res = await request(app).get('/?page=2');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      title: 'Admin - Devblog',
      posts: expect.arrayContaining([
        expect.objectContaining({ title: "post 1" }),
        expect.objectContaining({ title: "post 2" }),
      ]),
      totalPages: 10,
      currentPage: 2
    });
  });

  test('should return first page data when no page number is specified', async () => {
    Post.countDocuments.mockResolvedValue(20);
    Post.find.mockResolvedValue([...Array(10).keys()].map(i => ({ title: `post ${i + 1}` })));

    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      title: 'Admin - Devblog',
      posts: expect.arrayContaining([
        expect.objectContaining({ title: "post 1" }),
        expect.objectContaining({ title: "post 2" }),
      ]),
      totalPages: 2,
      currentPage: 1
    });
  });

  test('should handle errors', async () => {
    Post.countDocuments.mockImplementation(() => {
      throw new Error("Test error");
    });

    const res = await request(app).get('/');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Test error"});
  });
});
