require('dotenv').config()
const MJ_APIKEY_PUBLIC = process.env.MJ_APIKEY_PUBLIC;
const MJ_APIKEY_PRIVATE = process.env.MJ_APIKEY_PRIVATE;

const contact = async (req: any, res: any) => {
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
	  });}

module.exports = {
  contact
};