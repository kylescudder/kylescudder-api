import createPassport from './passport'

const mongoose = require('mongoose')

const server = 'vscodetodo_user:D9qKLE2wVBH2R68b@vscodetodo.nsbh7.mongodb.net'
const database = 'vscodetodo'

const connectDB = async () => {
  await createPassport()

  mongoose.connect(`mongodb+srv://${server}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  return mongoose.connection;
}
export default connectDB
