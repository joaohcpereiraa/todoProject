import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { TaskId } from "./taskId";
import { ITaskDTO } from "../dto/ITaskDTO";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { ICreateTaskDTO } from "../dto/ICreateTaskDTO";


interface TaskProps {
    title: string;
    completed: boolean;
}

export class Task extends AggregateRoot<TaskProps> {

    get id(): UniqueEntityID {
        return this._id;
    }

    get taskId(): TaskId {
        return new TaskId(this.id.toValue());
    }

    get title(): string {
        return this.props.title;
    }

    get completed(): boolean {
        return this.props.completed;
    }

    private constructor(props: TaskProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(taskDTO: ICreateTaskDTO, id?: UniqueEntityID): Result<Task> {
        const task = new Task({
            title: taskDTO.title,
            completed: taskDTO.completed ?? false
        }, id);

        const guardedProps = [
            { argument: task.title, argumentName: 'title' },
            { argument: task.completed, argumentName: 'completed' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Task>(guardResult.message);
        }

        if (task.title.trim() === '') {
            return Result.fail<Task>('Title is required');
        }

        const createdTask = new Task({ title: task.title, completed: task.completed }, id);
        return Result.ok<Task>(createdTask);
    }
}