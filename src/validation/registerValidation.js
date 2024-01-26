const joiValidate = require("joi")

// schema validate
const registerValidate = joiValidate.object({
	nama: joiValidate
		.string()
		.min(10)
		.max(25)
		.required(),

	email: joiValidate
		.string()
		.email()
		.min(5)
		.max(30)
		.required(),

	umur: joiValidate.number().integer().required,

	address: joiValidate
		.string()
		.alphanum()
		.max(255)
		.required(),

	noTelpone: joiValidate.number().integer().required,

	password: joiValidate
		.string()
		.alphanum()
		.min(10)
		.max(30)
		.required()
})

module.exports = registerValidate
