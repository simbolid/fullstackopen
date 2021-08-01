import React, { useState } from "react";

const Blog = ({ blog }) => { 
  const [open, setOpen] = useState(false);

  const blogStyle = {
    display: "inline-block",
    paddingBlock: 10,
    paddingInline: 5,
    marginBottom: 5,
    border: 'solid',
    borderColor: 'gray',
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

  return (
    <>
      <div style={blogStyle}>
        <span>
          <em>{`${blog.title} `}</em> {`by ${blog.author}`}
          <button 
            style={buttonSpacing}
            onClick={toggleOpen}
          >
            { open ? "Close" : "View" }
          </button>
        </span>
        <div style={showWhenOpen}>
          {blog.url}
          <br></br>
          Likes: {blog.likes}
          <button style={buttonSpacing}>
            Like
          </button>
        </div>
      </div>
      <br></br>
    </>
  );
};

export default Blog;
