const mongoose = require('mongoose');
const supertest = require('supertest');
const User = require('../models/user');
const app = require('../app');

const api = supertest(app);

const initialUsers = [
  {
    username: 'initial user',
    password: 'abi8302##',
  },
];

const usersInDb = async () => {
  const usersAtEnd = await User.find({});
  return usersAtEnd.map((blog) => blog.toJSON());
};

beforeEach(async () => {
  await User.deleteMany({});

  const userObjects = initialUsers.map((blog) => new User(blog));
  const promiseArray = userObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);
});

describe('creating a user', () => {
  test('succeeds with valid data', async () => {
    const newUser = ({
      username: 'new user',
      password: 's79byd@d#',
    });

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(initialUsers.length + 1);
  });

  test('fails when the username is already taken', async () => {
    const newUser = ({
      username: 'initial user',
      password: 's79byd@d#',
    });

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(initialUsers.length);
  });

  test('fails when the username is under three characters', async () => {
    const newUser = ({
      username: 'in',
      password: 's79byd@d#',
    });

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(initialUsers.length);
  });

  test('fails when the password is not provided', async () => {
    const newUser = ({
      username: 'initial',
    });

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(initialUsers.length);
  });

  test('fails when the password is under three characters', async () => {
    const newUser = ({
      username: 'initial',
      password: '12',
    });

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(initialUsers.length);
  });
});

afterAll(() => mongoose.connection.close());
