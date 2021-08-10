import React, { useState } from "react";

const Blog = ({ blog, deleteBlog, updateBlog, userId }) => {
  const [open, setOpen] = useState(false);

  const blogStyle = {
    display: "inline-block",
    paddingBlock: 10,
    paddingInline: 5,
    marginBottom: 5,
    border: "solid",
    borderColor: "gray",
    borderWidth: open ? 1 : 0,
    borderRadius: 5,
  };

  const showWhenOpen = { display: open ? "" : "none" };

  const buttonSpacing = {
    marginLeft: 4,
    width: 40,
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  const updateLikeCount = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };

    updateBlog(updatedBlog);
  };

  const deleteButton = () => {
    if (userId === blog.user.id) {
      return <button onClick={() => deleteBlog(blog)} className="deleteButton">Delete</button>;
    }
  };

  return (
    <>
      <div style={blogStyle} className="alwaysVisible">
        <span>
          <em>{`${blog.title} `}</em> {`by ${blog.author}`}
          <button style={buttonSpacing} onClick={toggleOpen}>
            {open ? "Close" : "View"}
          </button>
        </span>
        <div style={showWhenOpen} className="togglable">
          {blog.url}
          <br></br>
          Likes: {blog.likes}
          <button
            style={buttonSpacing}
            onClick={updateLikeCount}
            className="likeButton"
          >
            Like
          </button>
          <br></br>
          {deleteButton()}
        </div>
      </div>
      <br></br>
    </>
  );
};

export default Blog;
