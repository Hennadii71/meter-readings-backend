import express from "express";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";

import authRouter from "./routes/api/auth-router.js";
import objectRouter from "./routes/api/object-router.js";

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
// app.use(cors("*"));
const isProduction = app.get("env") === "production";
const corsOptions = {
  origin: isProduction ? ["https://pokaznyky.net.ua"] : "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: isProduction ? true : false,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/objects", objectRouter);

app.use("/api/auth", authRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  const isDevelopment = app.get("env") === "development";
  if (isDevelopment) {
    console.error(err.stack);
  } else {
    console.error(`${err.name}: ${err.message}`);
  }
  const status = err.status || 500;
  let responseMessage = err.message || "Internal Server Error";
  if (status === 500 && !isDevelopment) {
    responseMessage =
      "Something went wrong on our server. Please try again later.";
  }
  res.status(err.status || 500).json({
    message: responseMessage,
    ...(isDevelopment && { stack: err.stack }),
  });
});

export default app;
