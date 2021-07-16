const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const initialBlogs = require('./example_bloglist');

const api = supertest(app);

const notesInDb = async () => {
  const blogsAtEnd = await Blog.find({});
  return blogsAtEnd.map((blog) => blog.toJSON());
};

let token;

// create a user and retrieve authorization token
beforeAll(async () => {
  await User.deleteMany({});

  const user = {
    username: 'user',
    password: 'password',
  };

  await api
    .post('/api/users')
    .send(user);

  const response = await api
    .post('/api/login')
    .send(user);

  token = response.body.token;
});

// clear and initialize databases
beforeEach(async () => {
  await Blog.deleteMany({});

  const users = await User.find({});
  const user = users[0];

  // the delete operation relies on each blog having a ref to its user
  initialBlogs.forEach((blog) => {
    blog.user = user._id;
  });

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);
});

describe('when there are blogs in the database', () => {
  test('the server returns the correct number of blogs in JSON format', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('the unique identifier property of blog posts is named "id"', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`);

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
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send(missingTitle)
      .expect(400);

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(missingUrl)
      .expect(400);

    // make sure no notes have been added to database
    const blogsAtEnd = await notesInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
  });

  test('fails with status code 401 without token authorization', async () => {
    const newBlog = {
      title: 'Example Blog',
      author: 'Mary Sue',
      url: 'example.com',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401);
  });
});

describe('deleting a blog', () => {
  test('succeeds with status code 204 when the ID is valid', async () => {
    const blogsAtStart = await notesInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await notesInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    // this step also checks for duplicate urls
    const urls = blogsAtEnd.map((note) => note.id);
    expect(urls).not.toContain(blogToDelete.url);
  });
});

describe('updating a blog\'s like count', () => {
  test('succeeds with status code 200 when the ID is valid', async () => {
    const blogsAtStart = await notesInDb();
    const blogToUpdate = blogsAtStart[0];
    const likeCount = blogToUpdate.likes + 1;

    const update = {
      likes: likeCount,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(update)
      .expect(200);

    const blogsAtEnd = await notesInDb();
    expect(blogsAtEnd[0].likes).toBe(likeCount);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
