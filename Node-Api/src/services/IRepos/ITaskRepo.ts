import {Repo} from "../../core/infra/Repo";
import { Task } from "../../domain/task";

export default interface ITaskRepo extends Repo<Task> {
    save(specialization: Task): Promise<Task>;
}