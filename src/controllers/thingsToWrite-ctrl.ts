import fetch from 'node-fetch'
import { Request, Response } from 'express'

require('dotenv').config()

// const issues = async (req: Request, res: Response) => {
//  let milestoneNumber = 0
//  const { repo, milestone, at_id } = req.body;
//  // Request to exchange code for an access token
//  try {
//    const milestoneResponse = await fetch(`https://api.github.com/repos/PalomaSystems/${repo}/milestones`, {
//      headers: {
//        authorization: `token ${at_id}`,
//      },
//      method: 'GET',
//    })
//    const milestoneResponseJSON = await milestoneResponse.json()
//    for (let i = 0; i < milestoneResponseJSON.length; i++) {
//      const element = milestoneResponseJSON[i];
//      if (element.title === milestone) {
//        milestoneNumber = element.number
//      }
//    }
//    let url = ''
//    if (milestone !== '') {
//      url = `https://api.github.com/repos/PalomaSystems/${repo}/issues?milestone=${milestoneNumber}&per_page=100`
//    } else {
//      url = `https://api.github.com/repos/PalomaSystems/${repo}/issues?per_page=100`
//    }
//    const response = await fetch(url, {
//      headers: {
//        authorization: `token ${at_id}`,
//      },
//      method: 'GET',
//    })
//    const responseJSON = await response.json()
//    return res.status(200).json(responseJSON);
//  } catch (err) {
//    return res.status(400).json(err)
//  }
// }
const authenticate = async (req: Request, res: Response) => {
  const { code } = req.body
  const data = new FormData()
  data.append('client_id', process.env.THINGS_TO_WRITE_CLIENT_ID!)
  data.append('client_secret', process.env.THINGS_TO_WRITE_CLIENT_SECRET!)
  data.append('code', code)
  data.append('redirect_uri', process.env.THINGS_TO_WRITE_REDIRECT_URI!)
  let accessToken = ''
  // Request to exchange code for an access token
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    const responseData = await response.text()
    const params = new URLSearchParams(responseData)
    accessToken = params.get('access_token')!
    return res.status(200).json(accessToken)
  } catch (err) {
    return res.status(400).json(err)
  }
}
// const getUserDetails = async (req: Request, res: Response) => {
//  const userResponse = await fetch('https://api.github.com/user', {
//    headers: {
//      authorization: `token ${req.body.at_id}`,
//    },
//  });
//  const userResponseJSON = await userResponse.json()
//  res.status(200).json(userResponseJSON)
// }

module.exports = {
  // issues,
  authenticate
  // getUserDetails,
}
