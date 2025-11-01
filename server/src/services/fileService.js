import path from "path";
import fs from "fs/promises";
import multer from "multer";
import sanitize from "sanitize-filename";

const userFilesDir = path.resolve("../", "userfiles");
const configPath = path.resolve("models", "filedata.json");
const outPath = path.resolve("../", "userfiles");

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

async function createDirIfNotExist(fullpath) {
  try {
    await fs.access(fullpath);
  } catch (err) {
    await fs.mkdir(userdir);
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
      const sanitizedName = sanitize(file.originalname.normalize());
      const creationStamp = Date.now();
      const newName = `${username}-${creationStamp}`;
      const fileMeta = {
        originalName: sanitizedName,
        size: file.size / 1024,
        sizeMetric: "KB",
        creationStamp,
        username,
        fileID: newName,
      };
      const fullpath = path.join(userFilesDir, username, newName);

      // await fs.access(fullpath);
      const exists = await fileExists(sanitizedName);
      if (exists) {
        const err = new Error(
          `File with name "${sanitizedName}" already exists. `
        );
        err.status = 409;
        return cb(err);
      }

      cb(null, sanitizedName);
    } catch (err) {
      console.error(err);
      cb(err);
    }
  },
});

export const upload = multer({ storage });

export async function fileExists(originalName) {
  const filedata = JSON.parse(await fs.readFile());
  const exists = filedata.find((conf) => conf?.originalName === originalName);
  return !!exists;
}
// createFilesFromConfig();
