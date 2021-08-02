import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);

  const blogFormRef = useRef();
  const blogFormToggleRef = useRef();

  // automatically login if user data is in local storage
  useEffect(() => {
    const userJSON = window.localStorage.getItem("blogAppUser");
    if (userJSON) {
      const user = JSON.parse(userJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    if (user !== null) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("blogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);

      // in case the user logs in before the notification has expired
      setNotification(null);

      setUser(user);
    } catch (exception) {
      setNotification("Invalid credentials");
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setUsername("");
      setPassword("");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("blogAppUser");
    setUser(null);
    blogFormRef.current.clearForm();
    setNotification(null);
  };

  const createBlog = async (blogObject) => {
    try {
      const title = blogFormRef.current.title;
      const author = blogFormRef.current.author;

      blogFormToggleRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      setNotification(`${title} by ${author} added`);
    } catch (exception) {
      setNotification(exception.message);
    } finally {
      setTimeout(() => {
        setTimeout(() => setNotification(null), 5000);
      });
    }
  };

  const deleteBlog = async (blogObject) => {
    try {
      await blogService.delete_(blogObject);
      setBlogs(blogs.filter((blog) => blog.id !== blogObject.id));
      setNotification("Blog deleted");
    } catch (exception) {
      setNotification(exception.message);
    } finally {
      setTimeout(() => {
        setTimeout(() => setNotification(null), 5000);
      });
    }
  };

  const updateBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.update(blogObject);
      setBlogs(
        blogs.map((blog) => (blog.id !== returnedBlog.id ? blog : returnedBlog))
      );
    } catch (exception) {
      setNotification(exception.message);
    }
  };

  if (user === null) {
    return (
      <>
        <h2>Login</h2>
        <LoginForm
          username={username}
          onUsernameChange={({ target }) => setUsername(target.value)}
          password={password}
          onPasswordChange={({ target }) => setPassword(target.value)}
          handleLogin={handleLogin}
        />
        <Notification message={notification} />
      </>
    );
  }

  return (
    <>
      <h2>Blogs</h2>
      <p>
        {user.name} logged in
        <button type="button" onClick={handleLogout} style={{ marginLeft: 4 }}>
          Logout
        </button>
      </p>
      <Notification message={notification} />
      <Togglable buttonLabel="Create new blog" ref={blogFormToggleRef}>
        <BlogForm createBlog={createBlog} ref={blogFormRef} />
      </Togglable>
      <br></br>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            deleteBlog={deleteBlog}
            updateBlog={updateBlog}
            userId={user.id}
          />
        ))}
    </>
  );
};

export default App;
