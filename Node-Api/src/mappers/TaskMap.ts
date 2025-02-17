import { Document, Model } from "mongoose";
import { Mapper } from "../core/infra/Mapper";
import { ITaskPersistence } from "../dataschema/ITaskPersistence";
import { Task } from "../domain/task";
import { ITaskDTO } from "../dto/ITaskDTO";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";


export class TaskMap extends Mapper<Task> {
    public static toDTO (task: any): ITaskDTO {
        return {
            id: task.id.toString(),
            title: task.title,
            completed: task.completed
        };
    }

    public static toDomain (task: any | Model<ITaskPersistence & Document>): Task {

        const roleOrError = Task.create(
            task,
            new UniqueEntityID(task.domainId)
        );

        roleOrError.isFailure ? console.log(roleOrError.error) : '';
        return roleOrError.isSuccess ? roleOrError.getValue() : null;
    }

    public static toPersistence(task : Task): any {
        return {
            domainId: task.id.toString(),
            title: task.title,
            completed: task.completed
        };
    }

}