import React from "react";

const LoginForm = (props) => (
  <form onSubmit={props.handleLogin}>
    <p>
      username
      <input
        type="text"
        value={props.username}
        name="Username"
        onChange={props.onUsernameChange}
      />
      <br></br>
      password
      <input
        type="password"
        value={props.password}
        name="Password"
        onChange={props.onPasswordChange}
      />
    </p>
    <button type="submit">login</button>
  </form>
);

export default LoginForm;
