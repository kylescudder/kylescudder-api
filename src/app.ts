import 'reflect-metadata'
import express, { RequestHandler } from 'express'
import passport from 'passport'
import createPassport from './db/passport'
import createThingsToDoPassport from './db/thingsToDoPassport'

const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv-safe').config()
const mailRouter = require('./routes/mail-router')
const ghIssueBeautifierRouter = require('./routes/ghIssueBeautifier-router')
const thingsToWriteRouter = require('./routes/thingsToWrite-router')
const vsCodeToDoRouter = require('./routes/vsCodeToDo-router')
const thingsToDoRouter = require('./routes/thingsToDo-router')
const bigDayPlannerRouter = require('./routes/bigDayPlanner-router')

const main = async () => {
	const app = express()
	const apiPort = process.env.PORT
	app.use(cors())
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json())
	app.use(passport.initialize())
	app.use(express.json() as RequestHandler)
	await createPassport()
	await createThingsToDoPassport()

	app.use('/GHIssueBeautifier', ghIssueBeautifierRouter)
	app.use('/ThingsToWrite', thingsToWriteRouter)
	app.use('/Email', mailRouter)
	app.use('/VSCodeToDo', vsCodeToDoRouter)
	app.use('/ThingsToDo', thingsToDoRouter)
	app.use('/BigDayPlanner', bigDayPlannerRouter)

	app.get(
		'/VSCodeToDo/auth/github',
		passport.authenticate('github', { session: false })
	)
	app.get(
		'/VSCodeToDo/auth/github/callback',
		passport.authenticate('github', { session: false }),
		(req: any, res) => {
			res.redirect(`${process.env.EXTENSION_URL}/auth/${req.user.accessToken}`)
		}
	)
	app.get(
		'/ThingsToDo/auth/github',
		passport.authenticate('github', { session: false })
	)
	app.get(
		'/ThingsToDo/auth/github/callback',
		passport.authenticate('github', { session: false }),
		(req: any, res) => {
			res.redirect(`${process.env.THINGSTODO_REDIRECT_URL}/callback?code=${req.user.accessToken}`)
		}
	)

	app.get('/', (_req, res) => {
		res.send('Hello')
	})
	app.listen(apiPort)
}
main()
