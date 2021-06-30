import 'reflect-metadata'
import express from 'express'
import passport from 'passport'
import connectDB from './db/index'

const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv-safe').config();
const mailRouter = require('./routes/mail-router');
const ghIssueBeautifierRouter = require('./routes/ghIssueBeautifier-router');
const vsCodeToDoRouter = require('./routes/vsCodeToDo-router');

const main = async () => {
  const app = express();
  const apiPort = process.env.PORT;
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(express.json());
  const db = await connectDB()
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  app.use('/GHIssueBeautifier', ghIssueBeautifierRouter);
  app.use('/Email', mailRouter);
  app.use('/VSCodeToDo', vsCodeToDoRouter);

  app.get('/', (_req, res) => {
    res.send('Hello');
  });
  app.listen(apiPort, () => console.log(`listening on localhost:${process.env.PORT}`));
};
main();
