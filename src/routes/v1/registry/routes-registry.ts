import express, { Application, NextFunction, Request, Response, Router } from "express";
import createResponse from "../../../factory/response-factory";
import authRouter from "../auth-route";
import listenRouter from "../listen-route";

export default function registerRoutes(): Router {
    const router = express.Router();
    router.use('/auth', authRouter);
    router.use('/listen', listenRouter);

    // oops... 404 :/
    router.use(async (req: Request, res: Response, next: NextFunction) => {
        next(createResponse(404, "Route not found."))
    });
    return router;
}