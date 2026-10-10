import express from "express";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";

import usersRouter from "./routes/api/users-router.js";
import authRouter from "./routes/api/auth-router.js";

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors("*"));
app.use(express.json());

app.use("/api/users", usersRouter);

app.use("/api/auth", authRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
