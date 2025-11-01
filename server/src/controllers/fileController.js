import {
  addNewFileconfig,
  FILE_NOT_FOUND_ERROR,
  getFileContent,
  getFilePath,
  getUserFileConf,
  getUserFiles,
  removeFileconfig,
  removeUserFile,
} from "../services/fileService.js";
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
  const { username } = req.user;
  const { sanitizedName, creationStamp, newName, size: fileSize } = req.file;
  console.log(req.file);

  const fileMeta = {
    originalName: sanitizedName,
    size: (fileSize / 1024).toFixed(1),
    sizeMetric: "KB",
    creationStamp,
    username,
    fileID: newName,
  };

  const error = await addNewFileconfig(fileMeta);
  if (error) {
    const err = new Error("Error while creating file.");
    err.status = 500;
    res.status(err.status).json({ error: err });
  }

  res.status(200).json({ message: "File was successfully uploaded." });
}

export async function handleGetFileContents(req, res) {
  try {
    const fileID = req.params.fileID;
    const [confError, fileConf] = await getUserFileConf(
      req.user.username,
      fileID
    );

    if (confError) {
      console.error(confError);
      return res.status(500).json({ error: confError });
    }
    if (!fileConf) {
      return res.status(404).json({ error: FILE_NOT_FOUND_ERROR(fileID) });
    }

    const [contentError, fileContent] = await getFileContent(fileConf);
    if (contentError) throw contentError;
    return res.json({
      message: "Successfully retrived contents.",
      content: fileContent,
    });
  } catch (err) {
    console.error(err);
    res.status(err.status ?? 500).json({ error: err });
  }
}

export async function handleDelete(req, res) {
  try {
    const { username } = req.user;
    const { fileID } = req.query;

    // Order matters, if user tries to delete other users' file, only removeConfig will stop them
    const removeFromConfigError = await removeFileconfig(username, fileID);
    if (removeFromConfigError) {
      return res
        .status(removeFromConfigError.status ?? 500)
        .send({ error: removeFromConfigError });
    }

    const deleteFileError = await removeUserFile(username, fileID);
    if (deleteFileError) {
      return res
        .status(deleteFileError.status ?? 500)
        .send({ error: deleteFileError });
    }

    return res.status(200).send({ message: "Successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).send({ error });
  }
}

export async function handleDownload(req, res) {
  try {
    const { username } = req.user;
    const { fileID } = req.query;
    const [error, config] = await getUserFileConf(username, fileID);
    const filepath = getFilePath(username, fileID);

    if (error) {
      return res.status(error.status ?? 500).send({ error });
    }

    await res.download(filepath, config.originalName, (error) => {
      if (error) {
        console.error(error);
        res.status(error.status ?? 500).send({ error });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).send({ error });
  }
}
