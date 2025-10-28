import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "./AuthContext";
import { createContext } from "react";
import { api } from "../../api/api";

export const AuthContext = createContext({ isAuth: false });

export default function AuthContextProvider(props) {
  const [isAuth, setIsAuth] = useState(false);

  // useEffect(() => {
  //   if (sessionStorage.getItem("user")) setIsAuth(true);
  // }, []);
  useEffect(() => {
    if (localStorage.getItem("access-token")) setIsAuth(true);
  }, []);

  async function handleLogout() {
    try {
      const response = await api.post("/auth/logout");
      const { status } = response;
      if (!response.error) {
        localStorage.removeItem("access-token");
        setIsAuth(false);
        return;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLogin(login, pwd) {
    try {
      const response = await api.post("/auth/login", {
        login,
        password: pwd,
      });
      const {
        status,
        data: { message, error, accessToken },
      } = response;
      if (error) throw error;
      const success = String(status).startsWith("2");
      if (success) {
        setIsAuth(true);
        localStorage.setItem("access-token", accessToken);
        // sessionStorage.setItem("user", login);
        return [null, true];
      } else {
        return [{ status: 401, message: "Invalid credentials" }, false];
      }
    } catch (e) {
      const errorMessage = e.status === 401 ? "Invalid credentials" : e.message;
      console.error(e);
      return [{ status: e.status, message: errorMessage }, false];
    }
    //   if(response.status === 200 && )
  }

  async function handleSignup(login, pwd) {
    try {
      const { data = {}, status } = await api.post("/auth/signup", {
        username: login,
        password: pwd,
      });
      const { accessToken, error } = data;
      if (error || !accessToken) {
        throw error;
      }
      const success = String(status).startsWith("2");
      if (success) {
        localStorage.setItem("access-token", accessToken);
        setIsAuth(true);
        return [null, true];
      }
    } catch (e) {
      const message = e.response.data.message ?? "Server Error";
      return [{ message, status: e.status ?? 500 }, false];
    }
  }

  const authObj = { isAuth, handleLogin, handleLogout, handleSignup };

  return (
    <AuthContext.Provider value={authObj}>
      {props.children}
    </AuthContext.Provider>
  );
}
