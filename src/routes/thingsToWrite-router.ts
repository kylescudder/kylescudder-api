import express from 'express';
const thingsToWriteCtrl = require('../controllers/thingsToWrite-ctrl')
const router = express.Router()

router.use(function (_req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	next()
  })

router.post('/authenticate', thingsToWriteCtrl.authenticate)
//router.post('/issues', thingsToWriteCtrl.issues)
//router.post('/getuserdetails', thingsToWriteCtrl.getUserDetails)

module.exports = router