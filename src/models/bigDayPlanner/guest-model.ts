import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface Guest {
  forename: string;
  surname: string;
  guestGroupID: number;
}

// 2. Create a Schema corresponding to the document interface.
const guestSchema = new Schema<Guest>({
  forename: { type: String, required: true },
  surname: { type: String, required: true },
  guestGroupID: { type: Number, required: true },

});
const guestModel = model<Guest>('guest', guestSchema);

module.exports = guestModel;
