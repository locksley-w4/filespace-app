import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import process from "process";
import fs from "fs/promises";
import path from "path";

dotenv.config();

export async function rotateRefreshToken(
  username,
  newRefresh,
  oldRefresh = null
) {
  // if no old refresh is passed, just adds new token
  try {
    const dataPath = path.resolve("models", "refreshTokens.json");
    const data = JSON.parse(await fs.readFile(dataPath, "utf-8"));
    // if (!data[username]) {
    //   throw new Error(`No refresh tokens stored for user: ${username}`, {status: 500});
    // }
    data[username] = (data[username] ?? []).filter((el) => el !== oldRefresh);
    if (!data[username].includes(newRefresh)) {
      data[username].push(newRefresh);
    }
    const filedata = JSON.stringify(data);
    fs.writeFile(dataPath, filedata);
  } catch (e) {
    console.error(e);
  }
}
export async function removeRefreshToken(username, refreshToken) {
  try {
    const dataPath = path.resolve("models", "refreshTokens.json");
    const data = JSON.parse(await fs.readFile(dataPath, "utf-8"));
    data[username] = (data[username] ?? []).filter((el) => el !== refreshToken);
    const filedata = JSON.stringify(data);
    fs.writeFile(dataPath, filedata);
    return null;
  } catch (e) {
    console.error(e);
    return e;
  }
}

const { JWT_ACCESSTOKEN_SECRET, JWT_REFRESHTOKEN_SECRET } = process.env;

export function verifyRefreshToken(token) {
  let result = null;
  jwt.verify(token, JWT_REFRESHTOKEN_SECRET, (err, decoded) => {
    if (err) {
      return err;
    }
    result = decoded;
  });
  return result;
}

export function verifyAccessToken(token) {
  let result = null;
  jwt.verify(token, JWT_ACCESSTOKEN_SECRET, (err, decoded) => {
    if (err) {
      return err;
    }
    result = decoded;
  });
  return result;
}

export function getNewAccessToken(userdata, options) {
  const accessToken = jwt.sign(userdata, JWT_ACCESSTOKEN_SECRET, options);
  return accessToken;
}

export function getNewRefreshToken(userdata, options) {
  const refreshToken = jwt.sign(userdata, JWT_REFRESHTOKEN_SECRET, options);
  return refreshToken;
}
