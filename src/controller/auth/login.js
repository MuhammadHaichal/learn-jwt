const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const TableUser = require("../../models/users")
const loginValidate = require("../../validation/loginValidation")

// LOGIN
const Login = async (req, res) => {
	try {
		const { email, password } = req.body

		// check email fields
		const { error, value } =
			loginValidate.validate({
				email: email
			})

		// if email fields not valid
		if (error) {
			error.details.map(data => {
				return res.json({
					code: 400,
					errors: data.message
				})
			})
		}

		if (!error) {
			const users = await TableUser.findAll({
				where: { email: value.email }
			})

			// check password wrong or correct
			const matchPassword = await bcrypt.compare(
				password,
				users[0].password
			)

			// if password wrong
			if (!matchPassword) {
				res.status(403).json({
					statusCode: 401,
					msg: "Wrong Password, Try Again !"
				})
			}

			const userId = users[0].id
			const userEmail = users[0].email
			const accessToken = jwt.sign(
				{ userId, userEmail },
				process.env.secretKey,
				{
					expiresIn: "30s"
				}
			)

			const refreshToken = jwt.sign(
				{ userId, userEmail },
				process.env.refreshKey,
				{
					expiresIn: "1d"
				}
			)

			await TableUser.update(
				{
					refreshToken: refreshToken
				},
				{
					where: {
						id: userId
					}
				}
			)

			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000
			})

			res.json({ accessToken })
		}
	} catch (error) {
		// if email not found
		res.status(404).json({
			msg: "Sory Email Not Found"
		})
	}
}

module.exports = Login
