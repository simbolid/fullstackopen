const listHelper = require('../utils/list_helper');
const blogs = require('./example_bloglist');

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('when list has only one blog, equals the likes of that blog', () => {
    const result = listHelper.totalLikes([blogs[0]]);
    expect(result).toBe(7);
  });

  test('of bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  });
});
