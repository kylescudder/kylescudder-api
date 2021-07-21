import { Schema } from 'mongoose';
import { bigDayPlannerConn } from '../../db/index'

// 1. Create an interface representing a document in MongoDB.
interface Guest {
  forename: string;
  surname: string;
  guestGroupID: number;
  starterID: string;
  mainCourseID: string;
  starterText: string;
  mainCourseText: string;
  attending: boolean;
}

// 2. Create a Schema corresponding to the document interface.
const guestSchema = new Schema<Guest>({
  forename: { type: String, required: true },
  surname: { type: String, required: true },
  guestGroupID: { type: Number, required: true },
  starterID: { type: String, required: false },
  mainCourseID: { type: String, required: false },
  starterText: { type: String, required: false },
  mainCourseText: { type: String, required: false },
  attending: { type: Boolean, required: false },
});
const guestModel = bigDayPlannerConn.model('guest', guestSchema);

module.exports = guestModel;
