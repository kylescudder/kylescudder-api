import passport from "passport"
import FormData from 'form-data'
import fetch from 'node-fetch'

require('dotenv').config()

const issues = async (req: any, res: any) => {
	const { repo } = req.body;
	// Request to exchange code for an access token
	try {
	  const response = await fetch(`https://api.github.com/repos/PalomaSystems/${repo}/issues`, {
		headers: {
		  Authorization: `token ${process.env.PERSONAL_ACCESS_TOKEN}`,
		},
		method: "GET",
	  })
	  const responseJSON = await response.json()
	  return res.status(200).json(responseJSON);     
	} catch (err) {
	  return res.status(400).json(err)
	}
}
const authenticate = async (req: any, res: any) => {
	const { code } = req.body;
	const data = new FormData();
	data.append("client_id", process.env.CLIENT_ID!);
	data.append("client_secret", process.env.CLIENT_SECRET!);
	data.append("code", code);
	data.append("redirect_uri", process.env.REDIRECT_URI!);
	let access_token = "";
	// Request to exchange code for an access token
	try {
	  const response = await fetch(`https://github.com/login/oauth/access_token`, {
		method: "POST",
		body: data,
	  })
	  const responseData = await response.text()
	  let params = new URLSearchParams(responseData);
	  access_token = params.get("access_token")!;
	//   const userResponse = await fetch(`https://api.github.com/user`, {
	// 	headers: {
	// 	  Authorization: `token ${access_token}`,
	// 	},
	//   });
	//   const userResponseJSON = await userResponse.json()
	  return res.status(200).json(access_token);
	} catch(err) {
	  return res.status(400).json(err);
	}
}
const getUserDetails = async (req: any, res: any) => {
	const userResponse = await fetch(`https://api.github.com/user`, {
		headers: {
			Authorization: `token ${req.body.at_id}`,
		},
	});
	const userResponseJSON = await userResponse.json()
	res.status(200).json(userResponseJSON)
} 
const authCallback = async (_req: any, _res: any) => {
	passport.authenticate('github', { session: false }),
	(req: any, res: any) => {
		res.redirect(`${process.env.EXTENSION_URL}/auth/${req.user.accessToken}`)
	}
}
const auth = async (_req: any, _res: any) => {
	passport.authenticate('github', { session: false })
}
module.exports = {
	issues,
	authenticate,
	getUserDetails,
	authCallback,
	auth
};