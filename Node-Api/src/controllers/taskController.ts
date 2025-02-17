import { Inject, Service } from "typedi";
import config from "../../config";
import ITaskService from "../services/IServices/ITaskService";
import { Request, Response, NextFunction } from "express";
import { ITaskDTO } from "../dto/ITaskDTO";
import { Result } from "../core/logic/Result";
import ITaskController from "./IControllers/ITaskController";
import { ICreateTaskDTO } from "../dto/ICreateTaskDTO";

@Service()
export default class TaskController implements ITaskController {
    constructor(
        @Inject(config.services.task.name) private taskServiceInstance: ITaskService,
    ) {}

    public async createTask(req: Request, res: Response, next: NextFunction) {
        try {
            const taskOrError = await this.taskServiceInstance.createTask(req.body as ICreateTaskDTO) as Result<ITaskDTO>;

            if (taskOrError.isFailure) {
                return res.status(400).json({ error: taskOrError.error });
            }

            const taskDTO = taskOrError.getValue();
            return res.status(201).json(taskDTO);

        } catch (err) {
            return next(err);
        }
    };

}