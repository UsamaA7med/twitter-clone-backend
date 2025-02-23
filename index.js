import express from "express";
import "dotenv/config";
import cookie from "cookie-parser";
import connectToDB from "./config/connectToDB.js";
import userRouter from "./routes/userRouter.js";

const app = express();

app.use(express.json());
app.use(cookie());

app.listen(process.env.PORT_NUMBER, async (req, res) => {
  console.log(`Server is running on port ${process.env.PORT_NUMBER}`);
});

connectToDB();

app.get("/api/auth", userRouter);

app.use((error, req, res, next) => {
  res
    .status(error.statusCode)
    .json({ status: error.statusMessage, message: error.message });
});
