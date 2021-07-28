import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

      console.log(user);

      // window.localStorage.setItem("blogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.log("Wrong credentials");
    }
  }

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
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default App;
