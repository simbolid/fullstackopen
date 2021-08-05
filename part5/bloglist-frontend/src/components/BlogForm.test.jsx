import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";
import BlogForm from "./BlogForm"; 

test("the form calls its event handler with the right details", () => {
  const createBlog = jest.fn();

  const title = "Blog Title";
  const author = "Mary Su";
  const url = "example.com";

  const component = render(<BlogForm createBlog={createBlog} />);
  const titleInput = component.container.querySelector('#title');
  const authorInput = component.container.querySelector('#author');
  const urlInput = component.container.querySelector('#url');
  const form = component.container.querySelector("form");

  fireEvent.change(titleInput, {target: { value: title }});
  fireEvent.change(authorInput, {target: { value: author }});
  fireEvent.change(urlInput, {target: { value: url }});
  fireEvent.submit(form);

  expect(createBlog.mock.calls[0][0]).toEqual({
    title,
    author,
    url,
  });
});
