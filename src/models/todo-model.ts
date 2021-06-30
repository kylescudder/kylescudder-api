import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface ToDo {
  id: number;
  text: string;
  completed: boolean;
  creatorId: number;
  categorieText: string;
}

// 2. Create a Schema corresponding to the document interface.
const todoSchema = new Schema<ToDo>({
  id: { type: Number, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, required: false },
  creatorId: { type: Number, required: true },
  categorieText: { type: String, required: true },
});
const todoModel = model<ToDo>('todos', todoSchema);

module.exports = todoModel;
