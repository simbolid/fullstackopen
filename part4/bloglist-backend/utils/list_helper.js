// returns the total likes of all the blogs in a bloglist
const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes;

  return blogs.reduce(reducer, 0);
};

// returns the blog with the most likes
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {};

  const mostLikes = Math.max(...blogs.map((blog) => blog.likes));
  return blogs.find((blog) => blog.likes === mostLikes);
};

module.exports = {
  totalLikes,
  favoriteBlog,
};
