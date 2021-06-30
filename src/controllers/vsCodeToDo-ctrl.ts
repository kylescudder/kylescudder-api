import jwt from 'jsonwebtoken'

require('dotenv').config()

const TODO = require('../models/todo-model')
const USER = require('../models/user-model')
const CATEGORIE = require('../models/categories-model')

const getUserId = async (req: any) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return 0
  }
  const token = await authHeader.split(' ')[1].toString()
  const payloadJWT: any = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  return payloadJWT.userId
}

const me = async (req: any, res: any) => {
  let userId: Number = 0
  try {
    userId = await getUserId(req)
  } catch (err) {
    res.send({ user: null })
    return
  }
  if (!userId) {
    res.send({ user: null })
    return
  }
  const users = await USER.findOne({
    id: userId,
  })
  res.send({ users })
}
const categories = async (_req: any, res: any) => {
  const payload = await CATEGORIE.find({})
    .sort({
      text: 1,
    })
  res.send({ payload })
}
const todoList = async (req: any, res: any) => {
  let userId: Number = 0
  userId = await getUserId(req)
  const filterDate: Date = new Date()
  filterDate.setHours(filterDate.getHours() - 1)
  try {
    const payload = await TODO.find({
      creatorId: userId,
    })
      .or([
        { completedDate: { $exists: false } },
        { completedDate: { $gt: filterDate } },
      ])
      .sort({
        completed: 1,
        categorieText: 1,
        id: 1,
      })
    if (!payload.length) {
      return res
        .status(404)
        .json({ success: false, error: 'To Dos not found' })
    }
    return res.status(200).json({ success: true, data: payload })
  } catch (err: any) {
    return res.status(400).json({ success: false, data: err })
  }
}
const todoAdd = async (req: any, res: any) => {
  let userId: Number = 0
  userId = await getUserId(req)
  const payload = await TODO.find({})
    .sort({
      id: -1,
    })
    .limit(1)

  if (req.body.text.length < 500) {
    await TODO.create({
      text: req.body.text,
      creatorId: userId,
      categorieText: req.body.categorieText,
      id: (payload[0].id + 1),
    })
  }
  res.send({ })
}
const todoUpdate = async (req: any, res: any) => {
  let userId: Number = 0
  userId = await getUserId(req)
  const payload = await TODO.findOne({
    id: req.body.id,
  })
  if (!payload) {
    res.send({ todo: null })
    return
  }
  if (payload.creatorId !== userId) {
    throw new Error('You are not authorised to do this')
  }
  payload.completed = !payload.completed
  payload.completedDate = new Date()
  await TODO.updateOne(
    { id: req.body.id },
    {
      $set: {
        completed: payload.completed,
        completedDate: payload.completedDate,
      },
    },
  )
  res.send('success')
}

module.exports = {
  me,
  categories,
  todoList,
  todoAdd,
  todoUpdate,
}