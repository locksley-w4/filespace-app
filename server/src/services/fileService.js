import path from "path";
import fs from "fs/promises";

export function getUserFiles(username, filedata) {
  if (!filedata) {
    return null;
  }
  const filtered = filedata.filter((file) => file.username === username);
  const sorted = filtered.sort((a, b) => +b.creationStamp - +a.creationStamp);
  return sorted;
}

async function createFilesFromConfig() {
  const configPath = path.resolve("models", "filedata.json");
  const outPath = path.resolve("server", "userfiles");
  const configData = JSON.parse(await fs.readFile(configPath, "utf-8"));
  for (const conf of configData) {
    const userDir = path.join(outPath, conf.name);
    await fs.mkdir(userDir, { recursive: true });
    await fs.appendFile(path.join(userDir, conf.name), "", "utf-8");
  }
}

createFilesFromConfig();
