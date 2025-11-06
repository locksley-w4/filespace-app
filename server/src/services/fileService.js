import path from "path";
import fs from "fs/promises";
import multer from "multer";
import sanitize from "sanitize-filename";

const userFilesDir = path.resolve("../", "userfiles");
const configPath = path.resolve("models", "filedata.json");
const outPath = path.resolve("../", "userfiles");

export const FILE_NOT_FOUND_ERROR = (fileID) => {
  const err = new Error(`No file found with id: ${fileID}.`);
  err.status = 404;
  return err;
};

export function getUserFiles(username, filedata) {
  if (!filedata) {
    return null;
  }
  const filtered = filedata.filter((file) => file.username === username);
  const sorted = filtered.sort((a, b) => +b.creationStamp - +a.creationStamp);
  return sorted;
}

async function createFilesFromConfig() {
  const configData = JSON.parse(await fs.readFile(configPath, "utf-8"));
  for (const conf of configData) {
    const userDir = path.join(outPath, conf.username);
    console.log(userDir);

    await fs.mkdir(userDir, { recursive: true });
    await fs.appendFile(path.join(userDir, conf.name), "", "utf-8");
  }
}

export async function createUserfilesDirIfNotExist() {
  try {
    await createDirIfNotExist(outPath);
  } catch (err) {
    console.error(err);
  }
}

async function createDirIfNotExist(fullpath) {
  try {
    await fs.access(fullpath);
  } catch (err) {
    await fs.mkdir(fullpath);
  }
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { username } = req.user;
      const userdir = path.join(userFilesDir, username);
      await createDirIfNotExist(userdir);
      cb(null, userdir);
    } catch (e) {
      console.error(e);
      cb(e);
    }
  },
  filename: async (req, file, cb) => {
    try {
      const { username } = req.user;
      const originalName = Buffer.from(file.originalname, "latin1").toString(
        "utf-8"
      );
      const sanitizedName = sanitize(originalName.normalize());
      const creationStamp = Date.now();
      const newName = `${username}-${creationStamp}`;

      file.sanitizedName = sanitizedName;
      file.creationStamp = creationStamp;
      file.newName = newName;

      const exists = await fileExists(originalName);
      if (exists) {
        const err = new Error(
          `File with name "${sanitizedName}" already exists. `
        );
        err.status = 409;
        return cb(err);
      }

      cb(null, newName);
    } catch (err) {
      console.error(err);
      cb(err);
    }
  },
});

export const upload = multer({ storage });

export async function fileExists(originalName) {
  const filedata = JSON.parse(await fs.readFile(configPath));
  const exists = filedata.find(
    (conf) => conf?.originalName.localeCompare(originalName) === 0
  );
  return !!exists;
}

export async function addNewFileconfig(conf) {
  try {
    const filedata = JSON.parse(await fs.readFile(configPath));
    filedata.push(conf);
    await fs.writeFile(configPath, JSON.stringify(filedata), "utf-8");
    return null;
  } catch (e) {
    console.error(e);
    return e;
  }
}
export async function removeFileconfig(username, fileID) {
  try {
    let filedata = JSON.parse(await fs.readFile(configPath));
    const accessRightError = new Error(
      "You do not have enough permissions for this file."
    );
    accessRightError.status = 403;

    filedata = filedata.filter((conf) => {
      if (conf.fileID !== fileID) return true;
      if (conf.username === username) return false; // skips file (i.e removes), if it belongs to given user
      throw accessRightError; // raises error if user tries to delete other users' file
    });

    await fs.writeFile(configPath, JSON.stringify(filedata), "utf-8");
    return null;
  } catch (e) {
    console.error(e);
    return e;
  }
}

export async function removeUserFile(username, fileID) {
  try {
    const filedir = path.join(userFilesDir, username, fileID);
    await fs.unlink(filedir);
    return null;
  } catch (error) {
    console.error(error);
    return error;
  }
}
// createFilesFromConfig();

export async function getUserFileConf(username, fileID) {
  try {
    const filesData = JSON.parse(await fs.readFile(configPath, "utf-8"));

    if (!filesData) {
      return [null, null];
    }
    const result = filesData.find(
      (file) => file.username === username && file.fileID === fileID
    );
    if(!result) return [FILE_NOT_FOUND_ERROR(fileID), null];
    return [null, result];
  } catch (error) {
    console.error(error);
    return [error, null];
  }
}

export function getFilePath(username, fileID) {
  return path.join(outPath, username, fileID);
}

export async function getFileContent(fileConf) {
  const { fileID, username } = fileConf;
  try {
    const filepath = getFilePath(username, fileID);
    const content = (await fs.readFile(filepath)).toString("utf-8");
    return [null, content];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [FILE_NOT_FOUND_ERROR(fileID), null];
    }
    return [error, null];
  }
}
