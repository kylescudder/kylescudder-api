import passport from 'passport'
import jwt from 'jsonwebtoken'
import { Strategy as GitHubStrategy } from 'passport-github'

const USER = require('../models/user-model')
require('dotenv').config()

const createPassport = async () => {
	passport.use(
		new GitHubStrategy(
			{
				clientID: process.env.GITHUB_CLIENT_ID,
				clientSecret: process.env.GITHUB_CLIENT_SECRET,
				callbackURL: `${process.env.REDIRECT_URL}/auth/github/callback`
			},
			async (_, __, profile, cb) => {
				const payload = await USER.find({})
					.sort({
						id: -1
					})
					.limit(1)
				let user = await USER.find({
					githubId: profile.id
				})
				if (user.length > 0) {
					user.name = profile.displayName
				} else {
					let newId = 0
					if (payload === null) {
						newId = 1
					} else {
						newId = payload[0].id + 1
					}
					await USER.create({
						name: profile.displayName,
						githubId: profile.id,
						id: newId
					})
					user = await USER.find({
						githubId: profile.id
					})
				}
				cb(null, {
					accessToken: jwt.sign(
						{ userId: user[0].id },
						process.env.ACCESS_TOKEN_SECRET,
						{
							expiresIn: '1y'
						}
					)
				})
			}
		)
	)
	passport.serializeUser((user: any, done) => {
		done(null, user.accessToken)
	})
}
export default createPassport
