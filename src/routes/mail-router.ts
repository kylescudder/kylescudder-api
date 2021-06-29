import express from 'express';
const MailCtrl = require('../controllers/mail-ctrl')
const router = express.Router()

router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	next()
  })

router.post('/contact', MailCtrl.contact)

module.exports = router