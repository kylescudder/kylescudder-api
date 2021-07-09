const mongoose = require('mongoose')
require('dotenv-safe').config();

const server = process.env.MONGODB_SERVER
const toDoDatabase = 'vscodetodo'
const bigDayPlannerDatabase = 'wedding-site'

export const toDoConn = mongoose.createConnection(`mongodb+srv://${server}/${toDoDatabase}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

export const bigDayPlannerConn = mongoose.createConnection(`mongodb+srv://${server}/${bigDayPlannerDatabase}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
