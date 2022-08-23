import { Schema } from 'mongoose'
import { bigDayPlannerConn } from '../../db/index'

// 1. Create an interface representing a document in MongoDB.
interface BigDayPlannerUser {
  email: string;
  password: string;
  displayName: string;
}

// 2. Create a Schema corresponding to the document interface.
const bigDayPlannerUserSchema = new Schema<BigDayPlannerUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  displayName: { type: String }

})
const bigDayPlannerUserModel = bigDayPlannerConn.model('user', bigDayPlannerUserSchema)

module.exports = bigDayPlannerUserModel
