import { Result } from "../../core/logic/Result";
import { ICreateTaskDTO } from "../../dto/ICreateTaskDTO";
import { ITaskDTO } from "../../dto/ITaskDTO";

export default interface ITaskService {
    createTask(taskDTO: ICreateTaskDTO): Promise<Result<ITaskDTO>>;
}