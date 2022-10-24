import express, { Router } from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/errorMiddleware.js";
import helmet from "helmet";
import dotenv from "dotenv";
import db from "./config/db.js";
dotenv.config();

export class App {
  constructor(controllers, port) {
    this.express = express();
    this.port = port;

    this.initializeDatabaseConnection();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  initializeMiddleware = () => {
    this.express.use(helmet());
    this.express.use(
      cors()
      // {
      //   origin:"http://localhost:3000",
      //   credentials:true,
      // }
    );
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
    this.express.use(cookieParser());
  };

  initializeControllers = (controllers) => {
    controllers.forEach((controller) => {
      this.express.use(`/api/${controller?.subRoute}`, controller.router);
    });
  };
  initializeErrorHandling = () => {
    this.express.use(ErrorMiddleware);
  };

  initializeDatabaseConnection = async () => {
    try {
      await db.authenticate();
      await db.sync({ force: false });
      console.log("Database connected");
    } catch (error) {
      throw new Error(error.message);
    }
  };

  listen() {
    this.express.listen(this.port, () =>
      console.log(`App listening on port ${this.port}`)
    );
  }
}

export default App;
