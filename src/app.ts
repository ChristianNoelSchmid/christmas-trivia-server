import express, { Application, Request, Response } from "express";
import createError from "http-errors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from 'express-fileupload';
import { verifyToken } from "./auth-middleware";
import cors from 'cors';

import { router } from "./router";

const app: Application = express();

const corsOptions = [{
  origin: "https://christmas-trivia-client-yuaystnuoq-uw.a.run.app",
  optionsSuccessStatus: 200
}, {
  origin: "https://christianssoftware.com/christmas-trivia",
  optionsSuccessStatus: 200
}];

app.use(cors(corsOptions));

app.use(fileUpload({
  createParentPath: true,
}));

app.use(express.static('public'));

// Body parsing Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(verifyToken);

// Routing Middleware. Return server error response
// if any error is thrown.
app.use("/", (req: Request, res: Response, next: any) => {
  try {
    router(req, res, next);
  } catch(error) {
    console.log(error);
    return res.status(500).send("Server error. Please try again later.");
  }
});

// catch 404 and forward to error handler
app.use(function (_req: Request, res: Response, next: any) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") == "development" ? err : {};

  // Send the error message
  res.status(err.status || 500).json({ msg: "an error has occurred" });
});

export { app };
