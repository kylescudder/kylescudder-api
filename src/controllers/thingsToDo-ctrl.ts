import jwt from "jsonwebtoken";
import { Request, Response } from "express";

require("dotenv").config();

const TODO = require("../models/todo-model");
const USER = require("../models/user-model");
const CATEGORIE = require("../models/categories-model");

//const getUserId = async (req: Request) => {
//  const authHeader = req.headers.authorization;
//  if (!authHeader) {
//    return 0;
//  }
//  const token = await authHeader.split(" ")[1].toString();
//  const payloadJWT: any = await jwt.verify(
//    token,
//    process.env.ACCESS_TOKEN_SECRET
//  );
//  return payloadJWT.userId;
//};

const getUserId = async (req: Request) => {
  let githubId: String = ''
  try {
    githubId = req.body.githubId
    if (!githubId) {
      return null;
    }
    const users = await USER.findOne({
      githubId: githubId,
    });
    return users.id
  } catch (err) {
    return null
  }
};
const categories = async (req: Request, res: Response) => {
  let userId: Number = 0;
  userId = await getUserId(req);
  const payload = await CATEGORIE.find({
    userId: userId,
  }).sort({
    text: 1,
  });
  let toDoPayload
  for (let i = 0; i < payload.length; i++) {
    const category = payload[i];
    const filterDate: Date = new Date()
    filterDate.setHours(filterDate.getHours() - 1)
    toDoPayload = await TODO.find({
      categorieId: category.id,
    })
    .or([
        { completed: false },
        { completed: { $exists: false } },
        { completedDate: { $gt: filterDate } },
      ])
    category.toDoCount = 0
    for (let ii = 0; ii < toDoPayload.length; ii++) {
      const todo = toDoPayload[ii];
      if (todo.categorieId === category.id) {
        category.toDoCount++
      }
    }
  }
  res.send({ payload });
};
//const categoryAdd = async (req: Request, res: Response) => {
//  let userId: Number = 0;
//  userId = await getUserId(req);
//  const payload = await CATEGORIE.find({})
//    .sort({
//      id: -1,
//    })
//    .limit(1);

//  if (req.body.categorieText.length < 500) {
//    await CATEGORIE.create({
//      text: req.body.categorieText,
//      id: payload[0].id + 1,
//      userId: userId,
//    });
//  }
//  res.send({});
//};
//const todoList = async (req: Request, res: Response) => {
//  let userId: Number = 0
//  userId = await getUserId(req)
//  const filterDate: Date = new Date()
//  filterDate.setHours(filterDate.getHours() - 1)
//  try {
//    const payload = await TODO.find({
//      creatorId: userId,
//    })
//      .or([
//        { completedDate: { $exists: false } },
//        { completedDate: { $gt: filterDate } },
//      ])
//      .sort({
//        completed: 1,
//        categorieId: 1,
//        id: 1,
//      });
//    if (!payload.length) {
//      return res
//        .status(404)
//        .json({ success: false, error: "To Dos not found" });
//    }
//    return res.status(200).json({ success: true, data: payload });
//  } catch (err: any) {
//    return res.status(400).json({ success: false, data: err });
//  }
//};
//const todoAdd = async (req: Request, res: Response) => {
//  let userId: Number = 0;
//  userId = await getUserId(req);
//  const payload = await TODO.find({})
//    .sort({
//      id: -1,
//    })
//    .limit(1);
//  if (req.body.text.length < 500) {
//    await TODO.create({
//      text: req.body.text,
//      targetDate: req.body.targetDate,
//      creatorId: userId,
//      categorieId: req.body.categorieId,
//      id: payload[0].id + 1,
//    });
//  }
//  res.send({});
//};
//const todoUpdate = async (req: Request, res: Response) => {
//  let userId: Number = 0;
//  userId = await getUserId(req);
//  const payload = await TODO.findOne({
//    id: req.body.id,
//  });
//  if (!payload) {
//    res.send({ todo: null });
//    return;
//  }
//  if (payload.creatorId !== userId) {
//    throw new Error("You are not authorised to do this");
//  }
//  payload.completed = !payload.completed;
//  payload.completedDate = new Date();
//  await TODO.updateOne(
//    { id: req.body.id },
//    {
//      $set: {
//        completed: payload.completed,
//        completedDate: payload.completedDate,
//      },
//    }
//  );
//  res.send("success");
//};

module.exports = {
  //me,
  categories,
  //categoryAdd,
  //todoList,
  //todoAdd,
  //todoUpdate,
};
