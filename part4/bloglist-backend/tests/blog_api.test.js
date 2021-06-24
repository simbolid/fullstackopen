const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const initialBlogs = require('./example_bloglist');

const api = supertest(app);

// clear and initialize test database before each test
beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);
});

test('server returns correct number of blogs in JSON format', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body).toHaveLength(initialBlogs.length);
});

test('the unique identifier property of blog posts is named "id"', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].id).toBeDefined();
});

test('server creates a valid note', async () => {
  const newBlog = {
    title: 'Example Blog',
    author: 'Mary Sue',
    url: 'example.com',
    likes: 10,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  // check that database has stored an additional document
  let blogsAtEnd = await Blog.find({});
  blogsAtEnd = blogsAtEnd.map((blog) => blog.toJSON());
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

  // check that database has stored the given document
  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).toContain('Example Blog');
});

afterAll(() => {
  mongoose.connection.close();
});
