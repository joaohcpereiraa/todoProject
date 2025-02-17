import { Inject, Service } from "typedi";
import ITaskService from "./IServices/ITaskService";
import config from "../../config";
import ITaskRepo from "./IRepos/ITaskRepo";
import { ITaskDTO } from "../dto/ITaskDTO";
import { Result } from "../core/logic/Result";
import { Task } from "../domain/task";
import { TaskMap } from "../mappers/TaskMap";
import { ICreateTaskDTO } from "../dto/ICreateTaskDTO";

@Service()
export default class TaskService implements ITaskService {
    constructor(
        @Inject(config.repos.task.name) private taskRepo: ITaskRepo,
        @Inject('logger') private logger,
    ) { }


    public async createTask(taskDTO: ICreateTaskDTO): Promise<Result<ITaskDTO>> {
        try{
            this.logger.info('Creating task', taskDTO);
            const taskOrError = Task.create({
                title: taskDTO.title,
                completed: taskDTO.completed
            });

            if(taskOrError.isFailure){
                this.logger.error('Error creating task', taskOrError.error);
                return Result.fail<ITaskDTO>(taskOrError.error);
            }

            const task = taskOrError.getValue();
            this.logger.info('Saving task', task);
            await this.taskRepo.save(task);

            const taskDTOResult = TaskMap.toDTO(task);
            return Result.ok<ITaskDTO>(taskDTOResult);

        } catch (err) {
            this.logger.error('Error creating task', err);
            throw err;
        }
    }
}