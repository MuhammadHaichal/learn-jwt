const joiValidate = require('joi')

// schema validate 
const loginValidate = joiValidate.object({
    email: joiValidate.string()
        .email()
        .min(5)
        .max(30)
        .required(),
})


module.exports = loginValidate