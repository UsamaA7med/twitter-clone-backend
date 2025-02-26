import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectToDB from "./config/connectToDB.js";

import corse from "cors";
import authRouter from "./routes/authRouter.js";
import { userRouter } from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import { notificationRouter } from "./routes/notificationRouter.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   corse({
//     origin: "*",
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization", "withcredentials"],
//     methods: "GET, POST, PUT, DELETE",
//     preflightContinue: false,
//     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//   })
// );

app.listen(process.env.PORT_NUMBER, async (req, res) => {
  console.log(`Server is running on port ${process.env.PORT_NUMBER}`);
});

connectToDB();

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/notification", notificationRouter);

app.use((error, req, res, next) => {
  res
    .status(error.statusCode)
    .json({ status: error.statusMessage, message: error.message });
});
