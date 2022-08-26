import { Schema } from 'mongoose'
import { toDoConn } from '../db/index'

// 1. Create an interface representing a document in MongoDB.
interface Category {
  id: number;
  text: string;
  userId: number;
  toDoCount: number;
}

// 2. Create a Schema corresponding to the document interface.
const categorySchema = new Schema<Category>({
	id: { type: Number, required: true },
	text: { type: String, required: true },
	userId: { type: Number, required: true },
	toDoCount: { type: Number, required: false }
})
const categoryModel = toDoConn.model('categories', categorySchema)

module.exports = categoryModel
