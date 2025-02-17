import {Repo} from "../../core/infra/Repo";
import { Task } from "../../domain/task";
import { TaskId } from "../../domain/taskId";

export default interface ITaskRepo extends Repo<Task> {
    save(specialization: Task): Promise<Task>;
    findAll(): Promise<Task[]>;
    findByTaskId(taskId: TaskId | string): Promise<Task>;
    delete(task: Task): Promise<void>;
}