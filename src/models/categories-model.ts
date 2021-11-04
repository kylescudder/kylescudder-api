import { Schema } from "mongoose";
import { toDoConn } from "../db/index";

// 1. Create an interface representing a document in MongoDB.
interface Categorie {
  id: number;
  text: string;
  userId: number;
}

// 2. Create a Schema corresponding to the document interface.
const categorieSchema = new Schema<Categorie>({
  id: { type: Number, required: true },
  text: { type: String, required: true },
  userId: { type: Number, required: true },
});
const categorieModel = toDoConn.model("categories", categorieSchema);

module.exports = categorieModel;
