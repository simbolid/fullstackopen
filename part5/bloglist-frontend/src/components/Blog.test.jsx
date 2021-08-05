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

  const visibleContent = component.container.querySelector(".alwaysVisible");
  expect(visibleContent).not.toHaveStyle("display: none");
  expect(visibleContent).toHaveTextContent(blog.title);
  expect(visibleContent).toHaveTextContent(blog.author);

  const hiddenContent = component.container.querySelector(".togglable");
  expect(hiddenContent).toHaveStyle("display: none");
  expect(hiddenContent).toHaveTextContent(blog.url);
  expect(hiddenContent).toHaveTextContent(blog.likes);
});