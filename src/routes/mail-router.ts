import express from 'express'

const mailCtrl = require('../controllers/mail-ctrl')

const router = express.Router()

router.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  next()
})

router.post('/contact', mailCtrl.contact)

module.exports = router
