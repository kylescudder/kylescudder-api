import 'reflect-metadata'
import express from 'express';
import { __prod__ } from './constants';
import passport from 'passport';
import { connectDB } from './db/index'
require("dotenv-safe").config();
const cors = require('cors')
const bodyParser = require('body-parser')
const mailRouter = require('./routes/mail-router')
const ghIssueBeautifierRouter = require('./routes/ghIssueBeautifier-router')
const vsCodeToDoRouter = require('./routes/vsCodeToDo-router')

const main = async () => {
    const app = express();
    const apiPort = process.env.PORT
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(passport.initialize());
    app.use(express.json());
    await connectDB()

    app.use('/GHIssueBeautifier', ghIssueBeautifierRouter);
    app.use('/Email', mailRouter);
    app.use('/VSCodeToDo', vsCodeToDoRouter)
    
    app.get('/', (_req, res) => {
        res.send("Hello");
    })
    app.listen(apiPort, () => console.log(`listening on localhost:${process.env.PORT}`));
};
main();

