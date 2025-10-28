import React, { useContext, useRef, useState } from "react";
import "./Signup.css";
import Container from "../../components/Container/Container";
import MyInput from "../../components/ui/MyInput/MyInput";
import Heading from "../../components/ui/Heading/Heading";
import MyButton from "../../components/ui/Button/MyButton";
import { AuthContext } from "../../context/AuthContext/AuthContextProvider";
import { Link } from "react-router";

export default function Signup() {
  //   const [login, setLogin] = useState("");
  //   const [password, setPassword] = useState("");
  const { handleSignup } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState(null);
  const usernameElem = useRef(null);
  const pwdElem = useRef(null);

  const handleSubmit = async () => {
    if (usernameElem.current && pwdElem.current) {
      const username = usernameElem.current.value;
      const pwd = pwdElem.current.value;
      if (!username || !pwd) {
        setErrorMsg("Login and Password must not be empty");
        return;
      }
      
      const [error, success] = await handleSignup(username, pwd);
      if (error) setErrorMsg(error.message);
    }
  };

  return (
    <div className="Signup">
      <form
        action="#"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Container>
          <Heading>Sign Up</Heading>
          {errorMsg && <p className="errorField">{errorMsg ?? "Server Error"}</p>}
          <label form="signup-input">
            Signup
            <MyInput
              id="signup-input"
              ref={usernameElem}
              placeholder="New username"
            />
          </label>
          <label form="signup-password">
            Password
            <MyInput
              ref={pwdElem}
              id="signup-password"
              type="password"
              placeholder="Password"
            />
          </label>
          <Link to="/login">Already have an account? Login</Link>
          <MyButton onClick={handleSubmit}>Sign Up</MyButton>
        </Container>
      </form>
    </div>
  );
}
