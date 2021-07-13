const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

// retrive the token from a request's authorization header
const getTokenFromReq = (request) => {
  // authorization header format: "Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW"
  const auth = request.get('authorization');

  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7);
  }
  return null;
};

// get all blogs
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', {
      username: 1,
      name: 1,
    });
  response.json(blogs);
});

// validate blog and save to database
blogRouter.post('/', async (request, response) => {
  const token = getTokenFromReq(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  // only allow logged-in users to add blogs
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  if (!request.body.title || !request.body.url) {
    return response.status(400).end();
  }

  if (!request.body.likes) {
    request.body.likes = 0;
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();

  // update user entry as well
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  // 201 created
  response.status(201).json(savedBlog);
});

// delete a blog
blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

// update a blog's like count
blogRouter.put('/:id', async (request, response) => {
  const update = { likes: request.body.likes };

  // the "new" option makes the operation return the updated note, making testing easier
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, update,
    { new: true });

  response.json(updatedBlog);
});

module.exports = blogRouter;
