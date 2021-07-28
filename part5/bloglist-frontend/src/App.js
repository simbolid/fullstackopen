import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

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
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.log("Wrong credentials");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("blogAppUser");
    setUser(null);
  };

  const addBlog = async (event) => {
    event.preventDefault();

    const newBlog = {
      title: title,
      author: author,
      url: url,
    };

    const returnedBlog = await blogService.create(newBlog);

    setBlogs(blogs.concat(returnedBlog));
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  if (user === null) {
    return (
      <>
        <h2>Login</h2>
        <LoginForm
          username={username}
          onUsernameChange={({target}) => setUsername(target.value)}
          password={password} 
          onPasswordChange={({target}) => setPassword(target.value)}
          handleLogin={handleLogin} 
        />
      </>
    )
  }

  return (
    <>
      <h2>Blogs</h2>
      <p>
        {user.name} logged in
        <button type="button" onClick={handleLogout}>
          logout
        </button>
      </p>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
      <h3>Create New</h3>
      <BlogForm 
        addBlog={addBlog}
        title={title}
        onTitleChange={({target}) => setTitle(target.value)}
        author={author}
        onAuthorChange={({target}) => setAuthor(target.value)}
        url={url}
        onURLChange={({target}) => setUrl(target.value)}
      />
    </>
  );
};

export default App;
