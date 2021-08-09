import React from "react";

const LoginForm = (props) => (
  <form onSubmit={props.handleLogin} id="loginForm">
    <p>
      Username
      <input
        type="text"
        value={props.username}
        name="Username"
        onChange={props.onUsernameChange}
      />
      <br></br>
      Password
      <input
        type="password"
        value={props.password}
        name="Password"
        onChange={props.onPasswordChange}
      />
    </p>
    <button type="submit">Login</button>
  </form>
);

export default LoginForm;
