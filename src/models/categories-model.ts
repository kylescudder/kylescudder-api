import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface Categorie {
  id: number;
  text: string;
}

// 2. Create a Schema corresponding to the document interface.
const categorieSchema = new Schema<Categorie>({
  id: { type: Number, required: true },
  text: { type: String, required: true },
});
const categorieModel = model<Categorie>('categories', categorieSchema);

module.exports = categorieModel;
