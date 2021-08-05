import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Blog from "./Blog";

test("initially renders blog title and author, but not url or likes", () => {
  const mockHandler = jest.fn();

  const blog = {
    title: "Lionel Messi Leaving Barca",
    author: "Perez",
    url: "fcbarcelona.com",
    likes: 0,
    user: {
      username: "user",
      name: "jeff",
      id: "jeff-id"
    }
  };

  const component = render(
    <Blog 
      blog={blog}
      updateBlog={mockHandler}
      deleteBlog={mockHandler}
      userId="some-Id"
    />
  );

  const unopened = component.container.querySelector('.initialView');

  expect(unopened).toHaveTextContent(blog.title);
  expect(unopened).toHaveTextContent(blog.author);
  expect(unopened).not.toHaveTextContent(blog.url);
  expect(unopened).not.toHaveTextContent(blog.likes);
});