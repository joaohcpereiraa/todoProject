import { Result } from "../../core/logic/Result";
import { ICreateTaskDTO } from "../../dto/ICreateTaskDTO";
import { ITaskDTO } from "../../dto/ITaskDTO";

export default interface ITaskService {
    createTask(taskDTO: ICreateTaskDTO): Promise<Result<ITaskDTO>>;
    listTasks(): Promise<Result<ITaskDTO[]>>;
    updateTask(id: string, taskDTO: Partial<ITaskDTO>): Promise<Result<ITaskDTO>>;
    removeTask(id: string): Promise<Result<void>>;
}