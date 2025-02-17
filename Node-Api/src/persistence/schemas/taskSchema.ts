import mongoose from "mongoose";
import { ITaskPersistence } from '../../dataschema/ITaskPersistence';

const Task = new mongoose.Schema({
    domainId: {
        type: String,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

export default mongoose.model<ITaskPersistence & mongoose.Document>('Task', Task);