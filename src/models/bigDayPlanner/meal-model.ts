import { Schema } from 'mongoose'
import { bigDayPlannerConn } from '../../db/index'

// 1. Create an interface representing a document in MongoDB.
interface Meal {
  course: string;
  mealName: string;
  vg: boolean
}

// 2. Create a Schema corresponding to the document interface.
const mealSchema = new Schema<Meal>({
  course: { type: String, required: true },
  mealName: { type: String, required: true },
  vg: { type: Boolean, required: true }

})
const mealModel = bigDayPlannerConn.model('meal', mealSchema)

module.exports = mealModel
