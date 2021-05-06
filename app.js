const express = require("express");
const bodyParser = require("body-parser");
const FormData = require("form-data");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const MJ_APIKEY_PUBLIC = process.env.MJ_APIKEY_PUBLIC
const MJ_APIKEY_PRIVATE = process.env.MJ_APIKEY_PRIVATE

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: false }));

// Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.post("/GHIssueBeautifier/authenticate", (req, res) => {
  const { code } = req.body;
  dotenv.config();
  const data = new FormData();
  data.append("client_id", process.env.CLIENT_ID);
  data.append("client_secret", process.env.CLIENT_SECRET);
  data.append("code", code);
  data.append("redirect_uri", process.env.REDIRECT_URI);
  let access_token = ''
  // Request to exchange code for an access token
  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    body: data,
  })
    .then((response) => response.text())
    .then((paramsString) => {
      let params = new URLSearchParams(paramsString);
      access_token = params.get("access_token");
      // Request to return data of a user that has been authenticated
      return fetch(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
    })
    .then((response) => response.json())
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
});

app.post("/GHIssueBeautifier/issues", (req, res) => {
  console.log(req.body)
  const { repo } = req.body;
  dotenv.config();
  // Request to exchange code for an access token
  fetch(`https://api.github.com/repos/PalomaSystems/${repo}/issues`, {
    headers: {
      Authorization: `token ${process.env.PERSONAL_ACCESS_TOKEN}`,
    },
    method: "GET"
  })
    .then((response) => response.json())
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
});
app.post('Email/contact', (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const message = req.body.message
  const mailjet = require('node-mailjet')
    .connect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE)
  const request = mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [{
        From: {
          Email: email,
          Name: name
        },
        To: [{
          Email: 'scud1997@gmail.com',
          Name: 'Kyle Scudder'
        }],
        Subject: 'Contact Form Message',
        TextPart: `Name: ${name} Email: ${email} Message: ${message}`,
        HTMLPart: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`
      }]
    })
  request
    .then(() => {
      res.json({ status: 'sent' })
    })
    .catch(() => {
      res.json({ status: 'failed' })
    })
})
app.get('/', (req, res) => {
  res.send('Hello world')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
