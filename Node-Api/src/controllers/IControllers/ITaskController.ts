import { Request, Response, NextFunction } from 'express';

export default interface ITaskController {
    createTask(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}