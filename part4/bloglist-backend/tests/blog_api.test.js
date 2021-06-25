const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const initialBlogs = require('./example_bloglist');

const api = supertest(app);

const notesInDb = async () => {
  const blogsAtEnd = await Blog.find({});
  return blogsAtEnd.map((blog) => blog.toJSON());
};

// clear and initialize test database before each test
beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);
});

describe('when there are blogs in the database', () => {
  test('the server returns the correct number of blogs in JSON format', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('the unique identifier property of blog posts is named "id"', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  });
});

describe('adding a blog', () => {
  test('succeeds with valid data', async () => {
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
    const blogsAtEnd = await notesInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

    // check that database has stored the correct document
    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain('Example Blog');
  });

  test('without the "likes" property succeeds, with "likes" set to zero', async () => {
    const newBlog = {
      title: 'Example Blog',
      author: 'Mary Sue',
      url: 'example.com',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await notesInDb();
    const { likes } = blogsAtEnd[blogsAtEnd.length - 1];

    expect(likes).toBe(0);
  });

  test('fails with status code 400 if "title" or "url" properties are missing', async () => {
    const missingTitle = {
      author: 'Mary Sue',
      url: 'example.com',
      likes: 10,
    };

    const missingUrl = {
      title: 'Example Blog',
      author: 'Mary Sue',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .send(missingTitle)
      .expect(400);

    await api
      .post('/api/blogs')
      .send(missingUrl)
      .expect(400);

    // make sure no notes have been added to database
    const blogsAtEnd = await notesInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
  });
});

describe('deleting a blog', () => {
  test('succeeds with status code 204 when the ID is valid', async () => {
    const blogsAtStart = await notesInDb();

    const blogToDelete = blogsAtStart[0];
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);

    const blogsAtEnd = await notesInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    // this step also checks for duplicate urls
    const urls = blogsAtEnd.map((note) => note.id);
    expect(urls).not.toContain(blogToDelete.url);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
