import express from 'express'

const bigDayPlannerCtrl = require('../controllers/bigDayPlanner-ctrl')
const auth = require('../middleware/auth')

const router = express.Router()

router.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  next()
})

router.post('/user/register', bigDayPlannerCtrl.registerUser)
router.post('/user/login', bigDayPlannerCtrl.loginUser)
router.delete('/user/delete', auth, bigDayPlannerCtrl.deleteUser)
router.post('/user/tokenIsValid', bigDayPlannerCtrl.tokenIsValidUser)
router.get('/user/', auth, bigDayPlannerCtrl.getUserInfo)

router.post('/guest', auth, bigDayPlannerCtrl.createGuest)
router.put('/guest/:id', auth, bigDayPlannerCtrl.updateGuest)
router.delete('/guest/:id', auth, bigDayPlannerCtrl.deleteGuest)
router.get('/guest/:id', auth, bigDayPlannerCtrl.getGuestById)
router.get('/guest', auth, bigDayPlannerCtrl.getGuests)

router.get('/getGuestGroup', bigDayPlannerCtrl.getGuestGroup)

module.exports = router
