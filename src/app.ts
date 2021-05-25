require("dotenv-safe").config();
import 'reflect-metadata'
import express from 'express';
import { __prod__ } from './constants';
import { Strategy as GitHubStrategy } from "passport-github"
import passport from 'passport';
import jwt from "jsonwebtoken";
import { isAuth } from './isAuth';
const MJ_APIKEY_PUBLIC = process.env.MJ_APIKEY_PUBLIC;
const MJ_APIKEY_PRIVATE = process.env.MJ_APIKEY_PRIVATE;
const MongoClient = require('mongodb').MongoClient

const main = async () => {
    const app = express();
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
    MongoClient.connect('mongodb+srv://vscodetodo_user:D9qKLE2wVBH2R68b@vscodetodo.nsbh7.mongodb.net/vscodetodo?retryWrites=true&w=majority', {
      useUnifiedTopology: true })
      .then((client: any) => {
        console.log('Connected to Database')
        const db = client.db('vscodetodo')

        app.get('/me', async (req, res) => {
          const authHeader = req.headers.authorization;
          if (!authHeader) {
              res.send({ user: null})
              return;
          }
          const token = authHeader.split(" ")[1];
          if (!token) {
              res.send({ user: null})
              return;
          }
          let userId = "";
          try {
              const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
              userId = payload.userId;
          } catch (err) {
              res.send({ user: null})
              return;
          }
          if (!userId) {
              res.send({ user: null})
              return;
          }
          const user = await db.collection('user').findOne({
            id: userId
          });
          res.send({ user })
        })

        app.get('/categories', isAuth, async (_req, res) => {
            const categorie = await db.collection('categories').find()
            .sort({
              text: 1
            })
            .toArray();
            res.send({ categorie });
        });

        app.get('/todo', isAuth, async (req, res) => {
          const todos = await getToDos(db, req);
          res.send({ todos })
        });

        app.post('/todo', isAuth, async (req, res) => {
            const maxID = await db.collection('to_do').find()
            .sort({
              id: -1
            })
            .limit(1)
            .toArray();
            if (req.body.text.length < 500) {
                await db.collection('to_do').insertOne({
                    text: req.body.text, 
                    creatorId: req.userId,
                    categorieText: req.body.categorieText,
                    id: (maxID[0].id + 1)
                });
            }
            res.send({  });
        });

        app.put('/todo', isAuth, async (req, res) => {
            const todo = await db.collection('to_do').findOne({
              id: req.body.id
            });
            if (!todo) {
                res.send({ todo: null });
                return
            }
            if (todo.creatorId !== req.userId) {
                throw new Error("You are not authorised to do this");
            }
            todo.completed = !todo.completed;
            todo.completedDate = new Date();
            db.collection('to_do').updateOne(
              { id : req.body.id },
              {
                $set: { 
                  completed: todo.completed,
                  completedDate: todo.completedDate
                }
              }
            );
            res.send('success');
        });

        async function getToDos(db: any, req: any) {
          const FilterDate: Date = new Date();
          FilterDate.setDate(FilterDate.getDate() - 8);
          const todos = await db.collection('to_do').find(
            {
              creatorId: req.userId,
              $or: [
                { completedDate: { $exists: false } },
                { completedDate: { $gt: FilterDate } }
              ]
            }
          )
            .sort({
              completed: 1,
              categorieText: 1,
              id: 1
            })
            .toArray();
          return todos;
        }

        passport.use(new GitHubStrategy({
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: `${process.env.API_URL}/auth/github/callback`
        },
          async (_, __, profile, cb) => {
            let user = await db.collection('user').findOne({
              githubId: profile.id
            });
            if (user) {
                user.name = profile.displayName
            } else {
              await db.collection('user').insertOne({
                name: profile.displayName, 
                githubId: profile.id,
              });
              user = await db.collection('user').findOne({
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
      })
      .catch((error: any) => console.error(error))
    
    passport.serializeUser(function(user: any, done) {
        done(null, user.accessToken);
    });
    app.use(passport.initialize());
    app.use(express.json());

    app.get('/auth/github',
      passport.authenticate('github', { session: false })
    );

    app.get(
        '/auth/github/callback', 
        passport.authenticate('github', { session: false }),
        (req: any, res) => {
            res.redirect(`${process.env.EXTENSION_URL}/auth/${req.user.accessToken}`)
        }
    );

    app.post("/GHIssueBeautifier/authenticate", (req, res) => {
      const { code } = req.body;
      const data = new FormData();
      data.append("client_id", process.env.CLIENT_ID!);
      data.append("client_secret", process.env.CLIENT_SECRET!);
      data.append("code", code);
      data.append("redirect_uri", process.env.REDIRECT_URI!);
      let access_token = "";
      // Request to exchange code for an access token
      fetch(`https://github.com/login/oauth/access_token`, {
        method: "POST",
        body: data,
      })
        .then((response) => response.text())
        .then((paramsString) => {
          let params = new URLSearchParams(paramsString);
          access_token = params.get("access_token")!;
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
      const { repo } = req.body;
      // Request to exchange code for an access token
      fetch(`https://api.github.com/repos/PalomaSystems/${repo}/issues`, {
        headers: {
          Authorization: `token ${process.env.PERSONAL_ACCESS_TOKEN}`,
        },
        method: "GET",
      })
        .then((response) => response.json())
        .then((response) => {
          return res.status(200).json(response);
        })
        .catch((error) => {
          return res.status(400).json(error);
        });
    });
    app.post("/Email/contact", (req, res) => {
      const name = req.body.name;
      const email = req.body.email;
      const message = req.body.message;
      const mailjet = require("node-mailjet").connect(
        MJ_APIKEY_PUBLIC,
        MJ_APIKEY_PRIVATE
      );
      const request = mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: email,
              Name: name,
            },
            To: [
              {
                Email: "scud1997@gmail.com",
                Name: "Kyle Scudder",
              },
            ],
            Subject: "Contact Form Message",
            TextPart: `Name: ${name} Email: ${email} Message: ${message}`,
            HTMLPart: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
          },
        ],
      });
      request
        .then(() => {
          res.json({ status: "sent" });
        })
        .catch(() => {
          res.json({ status: "failed" });
        });
    });
    
    app.get('/', (_req, res) => {
        res.send("Hello");
    })
    app.listen(process.env.PORT, () => {
        console.log(`listening on localhost:${process.env.PORT}`);
    });
};
main();

