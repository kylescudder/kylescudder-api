import { Schema } from 'mongoose';
import { toDoConn } from '../db/index'

// 1. Create an interface representing a document in MongoDB.
interface User {
  id: number;
  name: string;
  githubId: string;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<User>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  githubId: { type: String, required: false },
});
const userModel = toDoConn.model('users', userSchema);

module.exports = userModel;
