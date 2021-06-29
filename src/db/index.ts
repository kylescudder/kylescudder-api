import { createPassport } from "./passport";

const mongoose = require('mongoose');

const server = 'vscodetodo_user:D9qKLE2wVBH2R68b@vscodetodo.nsbh7.mongodb.net';
const database = 'vscodetodo';

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`mongodb+srv://${server}/${database}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await createPassport()
        console.log('MongoDB connected!!');
        return connection
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
};