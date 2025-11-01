import express from "express";
import { userRouter } from "./routes/userRoutes.js";
// import { sessionConfig } from "./config/sessionConfig.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleError } from "./services/utils.js";
import path from "path";

const app = express();
const port = process.env.PORT || 5000;

const __filename = import.meta.url;
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

// app.use(sessionConfig);

app.use("/api/v1", userRouter);

if (process.env.NODE_ENV === "production") {
  const clientDir = path.resolve("../../client/build");
  console.log(clientDir);
  
  app.use(express.static(clientDir));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(clientDir, "index.html"));
  });
}

app.use(handleError);

app.listen(port, (err) => {
  if (err) console.error(err);
  else console.log("Server is listening on port: ", port);
});
