import express, { Application, json, Request, Response } from "express";
import helmet from "helmet";
import cors from 'cors';
import cookieParser from "cookie-parser";
import morgan from "morgan";
import Logger from "../logger/winston-logger";
import registerRoutes from "../routes/v1/registry/routes-registry";
import path from "path";
import MongoDatabase from "../database/mongo-connector";
import UserController from "../database/controllers/user-controller";
import ActionType from "../garden/enums/action-type";
import xssSanitizer from 'xss-clean';
import mongoSanitizer from 'express-mongo-sanitize';
import { errorConverter, errorHandler } from "../middleware/error-handler";

class App {

    private app: Application = express();

    private db: MongoDatabase = new MongoDatabase();

    constructor() {
        this.loadDatabase();
        this.setHeaders();
        this.loadMiddleware();
        this.loadErrorHandling();
        this.loadRoutes();
    }

    private async loadDatabase() {
        this.db.connect(process.env.MONGO_URL as string);
    }

    private setHeaders() {
        this.app.use(function (req: Request, res: Response, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept"
            );
            res.setHeader(
                "Access-Control-Expose-Headers",
                "Total-Elements, Total-Pages, Current-Page"
            );
            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, PATCH, DELETE"
            );
            next();
        });
    }

    private loadMiddleware() {
        // Use Json and serve React
        this.app.use(json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.static(path.join(__dirname, '../../public')));
        // Cookie
        this.app.use(cookieParser());
        // Security 
        this.app.use(helmet());
        this.app.use(xssSanitizer());
        this.app.use(mongoSanitizer());
        this.app.use(cors());
        // Logger
        this.app.use(morgan('combined', {
            stream: {
                write: (text: string) => {
                    Logger.info(text)
                }
            }
        }));
    }

    private loadErrorHandling() {
        // Todo
    }

    private loadRoutes() {
        this.app.use('/api/v1', registerRoutes());
        // Convert and handle
        this.app.use(errorConverter);
        this.app.use(errorHandler);
    }

    public start(port: string | number) {
        this.app.listen(port, () => {
            Logger.info(`Server listening on port ${port}.`);
        });
    }

}

export default App