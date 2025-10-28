import React, { useContext } from "react";
import Login from "../pages/login/Login";
import Signup from "../pages/signup/Signup";
import { createBrowserRouter, RouterProvider } from "react-router";
import Main from "../pages/main/Main";
import { AuthContext } from "../context/AuthContext/AuthContextProvider";

const publicRoutes = [
  {
    path: "*",
    element: <Login />,
    errorElement: <p>404! Page not found...</p>,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <p>404! Page not found...</p>,
  },
];

const privateRoutes = [
  {
    path: "*",
    element: <Main/>,
  },
];

export default function AppRouter(props) {
  const { isAuth } = useContext(AuthContext);
  const router = createBrowserRouter(isAuth ? privateRoutes : publicRoutes);

  return <RouterProvider router={router}>{props.children}</RouterProvider>;
}
