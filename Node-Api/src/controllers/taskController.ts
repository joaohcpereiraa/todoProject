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

    public async listTasks(req: Request, res: Response, next: NextFunction) {
        try {
            const tasks = await this.taskServiceInstance.listTasks();
            return res.status(200).json(tasks);
        } catch (err) {
            return next(err);
        }
    }

    public async updateTask(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const taskOrError = await this.taskServiceInstance.updateTask(id, req.body as ITaskDTO) as Result<ITaskDTO>;
            
            if(taskOrError.isFailure){
                return res.status(400).json({ error: taskOrError.errorValue() });
            }

            const taskDTO = taskOrError.getValue();
            return res.status(200).json(taskDTO);

        } catch (err) {
           console.error("Error updating task", err);
              return next(err);
        }
    }

    public async removeTask(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const taskOrError = await this.taskServiceInstance.removeTask(id);
            
            if(taskOrError.isFailure){
                return res.status(400).json({ error: taskOrError.errorValue() });
            }

            const taskDTO = taskOrError.getValue();
            return res.status(200).json(taskDTO);

        } catch (err) {
           console.error("Error removing task", err);
              return next(err);
        }
    }

}