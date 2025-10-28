import React, { useContext, useRef, useState } from "react";
import "./Login.css";
import Container from "../../components/Container/Container";
import MyInput from "../../components/ui/MyInput/MyInput";
import Heading from "../../components/ui/Heading/Heading";
import MyButton from "../../components/ui/Button/MyButton";
import { AuthContext } from "../../context/AuthContext/AuthContextProvider";
import Signup from "../signup/Signup";
import { Link } from "react-router";

export default function Login() {
  //   const [login, setLogin] = useState("");
  //   const [password, setPassword] = useState("");
  const { handleLogin } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState(null);
  const loginElem = useRef(null);
  const pwdElem = useRef(null);

  const handleSubmit = async () => {
    if (loginElem.current && pwdElem.current) {
      const login = loginElem.current.value;
      const pwd = pwdElem.current.value;
      if(!login || !pwd) {
        setErrorMsg("Login and Password must not be empty");
        return;
      }
      const [error, success] = await handleLogin(login, pwd);
      if (error) setErrorMsg(error.message);
    }
  };

  return (
    <div className="Login">
      <form
        action="#"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Container>
          <Heading>Login</Heading>
          {errorMsg && <p className="errorField">{errorMsg}</p>}
          <label form="login-input">
            Login
            <MyInput id="login-input" ref={loginElem} placeholder="Login" />
          </label>
          <label form="login-password">
            Password
            <MyInput
              ref={pwdElem}
              id="login-password"
              type="password"
              placeholder="Password"
            />
          </label>
          <Link to="/signup">Don't have an account? Register</Link>
          <MyButton onClick={handleSubmit}>Login</MyButton>
        </Container>
      </form>
    </div>
  );
}
