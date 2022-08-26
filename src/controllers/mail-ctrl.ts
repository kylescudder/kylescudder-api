require('dotenv').config()
const mailJet = require('node-mailjet')

const { MJ_APIKEY_PUBLIC } = process.env
const { MJ_APIKEY_PRIVATE } = process.env

const contact = async (req: any, res: any) => {
	const { name } = req.body
	const { email } = req.body
	const { message } = req.body
	const mailjet = mailJet.connect(
		MJ_APIKEY_PUBLIC,
		MJ_APIKEY_PRIVATE
	)
	const request = mailjet.post('send', { version: 'v3.1' }).request({
		messages: [
			{
				from: {
					email,
					name
				},
				to: [
					{
						email: 'scud1997@gmail.com',
						name: 'Kyle Scudder'
					}
				],
				subject: 'Contact Form Message',
				textPart: `Name: ${name} Email: ${email} Message: ${message}`,
				htmlPart: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`
			}
		]
	})
	request
		.then(() => {
			res.json({ status: 'sent' })
		})
		.catch(() => {
			res.json({ status: 'failed' })
		})
}
export { }

module.exports = {
	contact
}
