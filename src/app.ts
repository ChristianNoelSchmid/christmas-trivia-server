import express, { Application, Request, Response } from "express";
import createError from "http-errors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from 'express-fileupload';
import { verifyToken } from "./auth-middleware";
import cors from 'cors';

import { router } from "./router";

const app: Application = express();

app.use(cors());

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

// Routing Middleware
app.use("/", router);

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
