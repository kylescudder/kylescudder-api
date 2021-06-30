import express from 'express';
const ghIssueBeautifierCtrl = require('../controllers/ghIssueBeautifier-ctrl')
const router = express.Router()

router.use(function (_req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	next()
  })

router.post('/authenticate', ghIssueBeautifierCtrl.authenticate)
router.post('/issues', ghIssueBeautifierCtrl.issues)
router.post('/getuserdetails', ghIssueBeautifierCtrl.getUserDetails)

module.exports = router