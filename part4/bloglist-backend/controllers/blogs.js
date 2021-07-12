const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

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
  if (!request.body.title || !request.body.url) {
    return response.status(400).end();
  }

  if (!request.body.likes) {
    request.body.likes = 0;
  }

  const users = await User.find({});
  const user = users[0];

  console.log(user);

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,

    // simply assign the first user for this exercise
    user: user.id,
  });

  const savedBlog = await blog.save();

  // update user entry as well
  user.blogs = user.blogs.concat(savedBlog);
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
