const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

userRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
    });
  response.json(users);
});

userRouter.post('/', async (request, response) => {
  const { body } = request;

  if (!body.password) {
    return response.status(400).json({
      error: 'missing password',
    });
  }
  if (body.password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least three characters long',
    });
  }

  // controls how much time needed to calculate a hash; recommended value is 10
  const saltRounds = 10;

  // storing hashed passwords are more secure than storing passwords directly
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = userRouter;
