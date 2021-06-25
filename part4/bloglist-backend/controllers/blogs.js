const blogRouter = require('express').Router();
const Blog = require('../models/blog');

// get all blogs
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
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

  const blog = new Blog(request.body);
  const savedBlog = await blog.save();

  // 201 created
  response.status(201).json(savedBlog);
});

module.exports = blogRouter;
