// Test generated by RoostGPT for test nodetest-nov using AI Type Azure Open AI and AI Model roost-gpt4-32k

const request = require('supertest');
const express = require('express');
const app = express();
const Post = require("../models/Post");
const User = require("../models/User");
const router = require('../routers/admin');

app.use(express.urlencoded({ extended: false }));
app.use('/admin', router);

// Mocking the authenticate middleware
jest.mock("../middlewares/auth", () => {
  return jest.fn((req, res, next) => next());
});

jest.mock("../models/Post");

describe('POST /edit/:id', () => {
  beforeEach(() => {
    Post.findByIdAndUpdate.mockClear();
  });

  test('it should update the post', async () => {
    const post = new Post({
      _id: 'postId',
      title: 'Old title',
      subtitle: 'Old subtitle',
      content: 'Old content',
    });

    Post.findByIdAndUpdate.mockResolvedValue(post);

    const response = await request(app)
      .post('/admin/edit/postId')
      .send({ title: 'New title', subtitle: 'New subtitle', content: 'New content' });

    expect(Post.findByIdAndUpdate).toBeCalledWith(
      'postId', {
        title: 'New title',
        subtitle: 'New subtitle',
        content: 'New content',
      }, {
        new: true,
      }
    );
    expect(response.status).toBe(302);
    expect(response.header.location).toBe('/admin/');
  });

  test('it should handle errors', async () => {
    Post.findByIdAndUpdate.mockRejectedValue(new Error('Error updating post'));
    const response = await request(app)
      .post('/admin/edit/postId')
      .send({ title: 'New title', subtitle: 'New subtitle', content: 'New content' });

    expect(Post.findByIdAndUpdate).toBeCalled();
    expect(response.status).toBe(500);
  });
});
