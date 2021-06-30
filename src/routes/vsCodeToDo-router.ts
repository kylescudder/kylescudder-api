import express from 'express'

const vsCodeToDoCtrl = require('../controllers/vsCodeToDo-ctrl')

const router = express.Router()

router.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next()
})

router.get('/me', vsCodeToDoCtrl.me)
router.get('/categories', vsCodeToDoCtrl.categories)
router.get('/todo', vsCodeToDoCtrl.todoList)
router.post('/todo', vsCodeToDoCtrl.todoAdd)
router.put('/todo', vsCodeToDoCtrl.todoUpdate)

module.exports = router
