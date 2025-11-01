import fs from "fs/promises";
import path from "path";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import process from "process";
import {
  getNewAccessToken,
  getNewRefreshToken,
  removeRefreshToken,
  rotateRefreshToken,
  verifyRefreshToken,
} from "../services/authService.js";

// dotenv.config();

//    JWT BASED AUTH
export const handleLogin = async (req, res) => {
  const dataPath = path.resolve("models", "userdata.json"); // mocking user DB. Can be replaced with real db.

  try {
    const data = await fs.readFile(dataPath, "utf-8");
    const userData = JSON.parse(data);
    const { login, password } = req.body;
    const success = String(userData[login]) === String(password);    

    if (!success) {
      throw new Error("Invalid credentials.", { cause: 401 });
    }

    const accessToken = getNewAccessToken(
      { username: login },
      { expiresIn: "7s" }
    );

    const refreshToken = getNewRefreshToken(
      { username: login },
      { expiresIn: "7d" }
    );

    rotateRefreshToken(login, refreshToken);

    res.cookie("rtoken", refreshToken, { httpOnly: true, secure: false });

    // req.session.user = {user: login};
    return res
      .status(200)
      .json({ message: "Successfull login", error: null, accessToken });
  } catch (e) {
    console.error(e);
    res.status(e.cause ?? 500).json({ message: e.message, error: e });
  }
};

export const handleRefresh = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.rtoken;

    if (!oldRefreshToken) return res.sendStatus(401);

    const { username } = verifyRefreshToken(oldRefreshToken);
    if (!username) {
      return res.sendStatus(401);
    }
    const accessToken = getNewAccessToken({ username }, { expiresIn: "30m" });

    const refreshToken = getNewRefreshToken({ username }, { expiresIn: "7d" });

    rotateRefreshToken(username, refreshToken, oldRefreshToken);

    res.cookie("rtoken", refreshToken, { httpOnly: true, secure: false });

    res.status(200).json({ accessToken });
    // const newAccessToken = jwt.()
  } catch (e) {
    console.error(e);
    res.status(e.cause ?? 500).json({ message: e.message, error: e });
  }
};

export const handleLogout = async (req, res) => {
  try {
    res.clearCookie("rtoken");
    const err = await removeRefreshToken();
    if (err) {
      return res
        .status(500)
        .json({ error: { message: "Unable to logout. Please try again" } });
    }
    return res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ error: { message: "Unable to logout. Please try again" } });
  }
};

export const handleSignup = async (req, res) => {
  const dataPath = path.resolve("models", "userdata.json"); // mocking user DB. Can be replaced with real db.

  try {
    const data = await fs.readFile(dataPath, "utf-8");
    const userData = JSON.parse(data);
    const { username, password } = req.body;
   
    if (userData[username]) {
      const err = new Error("Username is taken, please choose another")
      err.status = 409;      
      return res.status(409).json({ message: "Username is taken, please choose another", error: err });
    }

    userData[username] = password;
    await fs.writeFile(dataPath, JSON.stringify(userData));

    const accessToken = getNewAccessToken(
      { username: username },
      { expiresIn: "7s" }
    );

    const refreshToken = getNewRefreshToken(
      { username: username },
      { expiresIn: "7d" }
    );

    rotateRefreshToken(username, refreshToken);

    res.cookie("rtoken", refreshToken, { httpOnly: true, secure: false });

    // req.session.user = {user: login};
    return res
      .status(200)
      .json({ message: "Successfull signup", error: null, accessToken });
  } catch (e) {
    console.error(e);
    res.status(e.status ?? 500).json({ message: e.message, error: e });
  }
};

//    SESSION BASED AUTH
// export const handleLogin = async (req, res) => {
//   const dataPath = path.resolve("models", "userdata.json");
//   try {
//     const data = await fs.readFile(dataPath, "utf-8");
//     const userData = JSON.parse(data);
//     const { login, password } = req.body;
//     const success = String(userData[login]) === String(password);

//     if (success) {
//       req.session.user = {user: login};
//       return res
//         .status(200)
//         .json({ message: "Successfull login", error: null });
//     } else {
//       return res
//         .status(401)
//         .json({ message: "Fail: Incorrect credentials", error: null });
//     }
//   } catch (e) {
//     console.error(e);
//     res.status(502).json({ message: "Server error.", error: e });
//   }
// };

// export const handleLogout = async (req, res) => {
// if (!req.session.user) {
//   res.clearCookie("connect.sid");
//   return res.status(200).json({ message: "Already logged out" });
// }
//   req.session.destroy((err) => {
//     if (err) {
//       console.error(err);
//       return res
//         .status(500)
//         .json({ message: "Unable to logout. Try again later" });
//     }
//     res.clearCookie("connect.sid");
//     return res.status(200).json({ message: "Logged out successfully" });
//   });
// };
