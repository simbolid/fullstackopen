import React, { useState, useImperativeHandle } from "react";

const BlogForm = React.forwardRef(({ createBlog }, ref) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const clearForm = () => {
    setTitle("");
    setAuthor("");
    setUrl("");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog({
      title: title,
      author: author,
      url: url
    });

    clearForm();
  };

  useImperativeHandle(ref, () => ({
    title, 
    author,
    url,
    clearForm,
  }));

  return (
    <>
      <h3>Create new blog</h3>
      <form onSubmit={handleSubmit}>
        <p>
          Title:
          <input type="text" value={title} onChange={({ target }) => setTitle(target.value)} />
          <br></br>
          Author:
          <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)} />
          <br></br>
          URL:
          <input type="text" value={url} onChange={({ target }) => setUrl(target.value)} />
        </p>
        <button type="submit">Submit</button>
      </form>
    </>
  );
});

export default BlogForm;
