import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog />", () => {
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

  let component; 
  let handleUpdate; 
  let handleDelete;

  beforeEach(() => {
    handleUpdate = jest.fn();
    handleDelete = jest.fn();
    component = render(
      <Blog 
        blog={blog}
        updateBlog={handleUpdate}
        deleteBlog={handleDelete}
        userId="some-Id"
      />
    );
  })

  test("initially displays blog title and author, but not url or likes", () => {
    const visibleContent = component.container.querySelector(".alwaysVisible");
    expect(visibleContent).toBeVisible();
    expect(visibleContent).toHaveTextContent(blog.title);
    expect(visibleContent).toHaveTextContent(blog.author);

    const hiddenContent = component.container.querySelector(".togglable");
    expect(hiddenContent).not.toBeVisible();
    expect(hiddenContent).toHaveTextContent(blog.url);
    expect(hiddenContent).toHaveTextContent(blog.likes);
  });

  test("displays the url and number of likes when the togglable button is clicked", () => {
    const viewButton = component.getByText("View");
    fireEvent.click(viewButton);

    const hiddenContent = component.container.querySelector(".togglable");
    expect(hiddenContent).toBeVisible();
    expect(hiddenContent).toHaveTextContent(blog.url);
    expect(hiddenContent).toHaveTextContent(blog.likes);
  });

  test("calls the updateBlog handler each time the like button is clicked", () => {
    const likeButton = component.getByText("Like");
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);
    expect(handleUpdate.mock.calls).toHaveLength(2); 
  });
});
