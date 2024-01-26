const TableUser = require("../../models/users")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const registerValidate = require("../../validation/registerValidation")

// REGISTER
const Register = async (req, res) => {
	const {
		nama,
		email,
		umur,
		address,
		noTelpone,
		password
	} = req.body

	try {
		//  validation users inputed
		const { error, value } =
			registerValidate.validate({
				nama: nama,
				email: email,
				address: address,
				password: password
			})

		// if users send data not valid
		if (error) {
			return error.details.map(data => {
				res.json({
					code: 400,
					errors: data.message,
					message: ""
				})
			})
		}

		if (!error) {
			const salt = bcrypt.genSaltSync(10)
			const HashPassword = bcrypt.hashSync(
				value.password,
				salt
			)
			const createUsers = await TableUser.create(
				{
					nama: value.nama,
					email: value.email,
					umur: umur,
					address: value.address,
					noTelpone: noTelpone,
					password: HashPassword
				}
			)
			return res.sendStatus(201)
		}
	} catch (error) {
		// if user already usage
		if (error) {
			error.errors.map(data => {
				return res.json({
					code: 400,
					errors: data.message,
					message: ""
				})
			})
		} else {
			return
		}
	}
}

module.exports = Register
