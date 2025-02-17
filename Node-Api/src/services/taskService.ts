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

    public async listTasks(): Promise<Result<ITaskDTO[]>> {
        try{
            const tasks = await this.taskRepo.findAll();
            if(tasks.length === 0 || !tasks){
                return Result.fail<ITaskDTO[]>('No tasks found');
            }

            const taskDTOs = tasks.map(task => TaskMap.toDTO(task));

            return Result.ok<ITaskDTO[]>(taskDTOs);

        } catch (err) {
            this.logger.error('Error listing tasks', err);
            return Result.fail<ITaskDTO[]>("An error occurred listing tasks");
        }
    }

    public async updateTask(id: string, taskDTO: Partial<ITaskDTO>): Promise<Result<ITaskDTO>> {
        try{
            const task = await this.taskRepo.findByTaskId(id);

            if (!task) {
                return Result.fail<ITaskDTO>('Task not found');
            }

            if (taskDTO.title) {
                task.props.title = taskDTO.title;
            }

            if (taskDTO.completed) {
                task.props.completed = taskDTO.completed;
            }

            await this.taskRepo.save(task);

            const taskDTOResult = TaskMap.toDTO(task);

            return Result.ok<ITaskDTO>(taskDTOResult);

        } catch (err) {
            this.logger.error('Error updating task', err);
            return Result.fail<ITaskDTO>('An error occurred updating task');
        }

    }

    public async removeTask(id: string): Promise<Result<void>> {
        try{
            const taskm = await this.taskRepo.findByTaskId(id);

            if (!taskm) {
                return Result.fail<void>('Task not found');
            }

            await this.taskRepo.delete(taskm);
            return Result.ok<void>();

        } catch (err) {
            this.logger.error('Error removing task', err);
            return Result.fail<void>('An error occurred removing task');

        }
    }

}