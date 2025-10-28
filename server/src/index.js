import express from "express";
import { userRouter } from "./routes/userRoutes.js";
import { sessionConfig } from "./config/sessionConfig.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleError } from "./services/utils.js";

const app = express();
const port = 5000;

// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true
// }))
app.use(
  cors({
    origin: "http://localhost:14180",
    credentials: true,
  })
);

app.use(cookieParser())

app.use(express.json());

app.use(sessionConfig);

app.use("/api/v1", userRouter);

app.use(handleError)

app.listen(port, (err) => {
  if (err) console.error(err);
  else console.log("Server is listening on port: ", port);
});
