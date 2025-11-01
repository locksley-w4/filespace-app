import { getUserFiles } from "../services/fileService.js";
import path from "path";
import fs from "fs/promises";

export async function handleGetFiles(req, res) {
  try {
    if (!req.user) {
      throw Error("No userdata, please re-login", { cause: 403 });
    }
    const dataPath = path.resolve("models", "filedata.json");
    const fileData = JSON.parse(await fs.readFile(dataPath, "utf-8"));
    const { username } = req.user;
    const result = getUserFiles(username, fileData);

    res.status(200).json({ data: result });
  } catch (e) {
    res.status(e.cause ?? 500).json({ error: e });
  }
}

export async function handleUploadFile(req, res) {
  if (!req.file) {
    const err = new Error("No file was sent.");
    err.status = 409;
    res.status(400).json({ error: err });
  }
  res.status(200).json({ message: "File was successfully uploaded." });
}
