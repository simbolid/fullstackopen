import React from "react";

const BlogForm = (props) => (
  <form onSubmit={props.addBlog}>
    <p>
      Title:
      <input type="text" value={props.title} onChange={props.onTitleChange} />
      <br></br>
      Author:
      <input type="text" value={props.author} onChange={props.onAuthorChange} />
      <br></br>
      URL:
      <input type="text" value={props.url} onChange={props.onURLChange} />
    </p>
    <button type="submit">Submit</button>
  </form>
);

export default BlogForm;
