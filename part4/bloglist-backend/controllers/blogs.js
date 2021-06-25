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
