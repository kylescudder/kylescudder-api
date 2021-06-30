import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface User {
  id: number;
  name: string;
  githubId: string;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<User>({
  id: { type: Number, required: false },
  name: { type: String, required: true },
  githubId: { type: String, required: true },
});
const userModel = model<User>('user', userSchema, 'user');

module.exports = userModel;
