const TableUser = require("../models/users")
const jwt = require("jsonwebtoken")

const RefreshToken = async (req, res) => {
	try {
		const getTokenCookie = req.cookies.refreshToken

		// if not found cookies
		if (!getTokenCookie) return res.sendStatus(401)

		const users = await TableUser.findAll({
			where: {
				// membandingkan refreshToken yang ada di Db dengan refreshToken cookie
				refreshToken: getTokenCookie
			}
		})

		// if users not found
		if (!users[0]) return res.sendStatus(401)

		jwt.verify(
			getTokenCookie,
			process.env.refreshKey,
			function (error, decode) {
				if (error) return res.sendStatus(401)

				const userId = users[0].id
				const userNama = users[0].nama
				const userEmail = users[0].email

				// created new token
				const accessToken = jwt.sign(
					{ userId, userNama, userEmail },
					process.env.secretKey,
					{
						expiresIn: "30s"
					}
				)

				// send accessToken to client
				res.json({
					accessToken
				})
			}
		)
	} catch (error) {
		//  for debugging
		console.log(error)
	}
}

module.exports = RefreshToken
