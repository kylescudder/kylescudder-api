import passport from 'passport';
require('dotenv').config()
import jwt from "jsonwebtoken";
import { Strategy as GitHubStrategy } from "passport-github"
const mongoose = require('mongoose')

export const createPassport = async () => {
	passport.use(new GitHubStrategy({
		clientID: process.env.GITHUB_CLIENT_ID,
		clientSecret: process.env.GITHUB_CLIENT_SECRET,
		callbackURL: `${process.env.API_URL}/auth/github/callback`
	  },
		async (_, __, profile, cb) => {
		  let user = await mongoose.collection('user').findOne({
			githubId: profile.id
		  });
		  if (user) {
			  user.name = profile.displayName
		  } else {
			await mongoose.collection('user').insertOne({
			  name: profile.displayName, 
			  githubId: profile.id,
			});
			user = await mongoose.collection('user').findOne({
			  githubId: profile.id
			});
		  }
		  cb(null, {
			  accessToken: jwt.sign(
				  {userId: user.id }, 
				  process.env.ACCESS_TOKEN_SECRET, {
				  expiresIn: "1y",
			  }),
		  });
		}
	  ));
	  passport.serializeUser(function(user: any, done) {
        done(null, user.accessToken);
    });
}