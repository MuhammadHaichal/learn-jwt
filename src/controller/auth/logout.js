const TableUser = require("../../models/users")
const jwt = require("jsonwebtoken")

const Logout = async (req, res) => {
	try {
		const tokenCookie = req.cookies.refreshToken

		// if cookie not found
		if (!tokenCookie) return res.sendStatus(401)

		const users = await TableUser.findAll({
			where: {
				refreshToken: tokenCookie
			}
		})

		//  if user not match refreshToken
		if (!users) return res.sendStatus(401)

		const userId = users[0].id
		await TableUser.update(
			{ refreshTosken: null },
			{
				where: {
					id: userId
				}
			}
		)

		// remove cookie
		res.clearCookie("refreshToken")
		return res.sendStatus(200)
	} catch (error) {
		console.log(error)
	}
}

// REGISTER
module.exports = Logout
