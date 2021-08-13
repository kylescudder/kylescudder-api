import { Schema } from 'mongoose';
import { toDoConn } from '../db/index'

// 1. Create an interface representing a document in MongoDB.
interface ToDo {
  id: number;
  text: string;
  completed: boolean;
  creatorId: number;
  categorieText: string;
  completedDate: Date;
}

// 2. Create a Schema corresponding to the document interface.
const todoSchema = new Schema<ToDo>({
  id: { type: Number, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, required: false },
  creatorId: { type: Number, required: true },
  categorieText: { type: String, required: true },
  completedDate: { type: Date, required: false }
});
const todoModel = toDoConn.model('todos', todoSchema);

module.exports = todoModel;
