import express from 'express'

const thingsToDoCtrl = require('../controllers/thingsToDo-ctrl')

const router = express.Router()

router.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next()
})

//router.get('/me', thingsToDoCtrl.me)
router.post('/categories', thingsToDoCtrl.categories)
//router.post('/category', thingsToDoCtrl.categoryAdd)
//router.get('/todo', thingsToDoCtrl.todoList)
//router.post('/todo', thingsToDoCtrl.todoAdd)
//router.put('/todo', thingsToDoCtrl.todoUpdate)

module.exports = router
