// sum the likes of all the blogs in a bloglist
const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes;

  return blogs.reduce(reducer, 0);
};

module.exports = {
  totalLikes,
};
