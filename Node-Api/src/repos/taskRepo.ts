import { Document, FilterQuery, Model } from "mongoose";
import { Inject, Service } from "typedi";
import { ITaskPersistence } from "../dataschema/ITaskPersistence";
import ITaskRepo from "../services/IRepos/ITaskRepo";
import { Task } from "../domain/task";
import { TaskId } from "../domain/taskId";
import { TaskMap } from "../mappers/TaskMap";

@Service()
export default class TaskRepo implements ITaskRepo {
    // private models: any;

    constructor(
        @Inject('taskSchema') private taskSchema: Model<ITaskPersistence & Document>,
        @Inject('logger') private logger: any
    ) { }


    public async exists (task: Task): Promise<boolean> {
        const idX = task.id instanceof TaskId ? (<TaskId>task.id).toValue() : task.id;
        const query = { domainId: idX };
        const taskDocument = await this.taskSchema.findOne(query as FilterQuery<ITaskPersistence & Document>);
        return !!taskDocument === true;
    }



    public async save (task: Task): Promise<Task> {
        const query = { domainId: task.id.toString() };
        const taskDocument = await this.taskSchema.findOne(query);


        try{
            if(taskDocument === null){
                const rawTask: any = TaskMap.toPersistence(task);
                this.logger.info('Creating new task', rawTask);

                const taskCreated = await this.taskSchema.create(rawTask);

                return TaskMap.toDomain(taskCreated);
            } else {
                taskDocument.title = task.title;
                taskDocument.completed = task.completed;
                this.logger.info('Updating task', taskDocument);

                await taskDocument.save();
                return TaskMap.toDomain(taskDocument);
            }
        } catch (err) {
            this.logger.error('Error saving task', err);
            throw err;
        }
    }

    public async findAll (): Promise<Task[]> {
        const query = {};
        const taskRecords = await this.taskSchema.find(query as FilterQuery<ITaskPersistence & Document>);

        return taskRecords.map((taskRecord) => TaskMap.toDomain(taskRecord));
    }

    public async findByTaskId (taskId: TaskId | string): Promise<Task> {
        const query = { domainId: taskId};
        const taskRecord = await this.taskSchema.findOne(query as FilterQuery<ITaskPersistence & Document>);

        if(taskRecord != null){
            return TaskMap.toDomain(taskRecord);
        } else {
            return null;
        }   

    }


    public async delete (task: Task): Promise<void> {
        const query = { domainId: task.id.toString() };
        await this.taskSchema.deleteOne(query as FilterQuery<ITaskPersistence & Document>);
    }
}



    
   
