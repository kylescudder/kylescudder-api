const mongoose = require('mongoose')
require('dotenv-safe').config();

const server = process.env.MONGODB_SERVER
const toDoDatabase = 'vscodetodo'
const bigDayPlannerDatabase = 'wedding-site'

export const toDoConnectDB = async () => {
  await mongoose.connect(`mongodb+srv://${server}/${toDoDatabase}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  return mongoose.connection;
}
export const bigDayPlannerConnectDB = async () => {
  await mongoose.connect(`mongodb+srv://${server}/${bigDayPlannerDatabase}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  return mongoose.connection;
}
