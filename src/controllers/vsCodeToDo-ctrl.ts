require('dotenv').config()
import jwt from "jsonwebtoken";
const mongoose = require('mongoose')

const me = async (req: any, res: any) => {
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
          const user = await mongoose.collection('user').findOne({
            id: userId
          });
          res.send({ user })
}
const categories = async (req: any, res: any) => {
	const categorie = await mongoose.collection('categories').find()
	.sort({
	  text: 1
	})
	.toArray();
	res.send({ categorie });
}
const todoList = async (req: any, res: any) => {
	const todos = await getToDos(mongoose, req);
	res.send({ todos })
}
const todoAdd = async (req: any, res: any) => {
	const maxID = await mongoose.collection('to_do').find()
	.sort({
	  id: -1
	})
	.limit(1)
	.toArray();
	if (req.body.text.length < 500) {
		await mongoose.collection('to_do').insertOne({
			text: req.body.text, 
			creatorId: req.userId,
			categorieText: req.body.categorieText,
			id: (maxID[0].id + 1)
		});
	}
	res.send({  });
}
const todoUpdate = async (req: any, res: any) => {
	const todo = await mongoose.collection('to_do').findOne({
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
	  mongoose.collection('to_do').updateOne(
		{ id : req.body.id },
		{
		  $set: { 
			completed: todo.completed,
			completedDate: todo.completedDate
		  }
		}
	  );
	  res.send('success');
}
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

module.exports = {
  me,
  categories,
  todoList,
  todoAdd,
  todoUpdate
};