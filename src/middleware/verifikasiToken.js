const jwt = require("jsonwebtoken")

const verifikasiToken = (req, res, next) => {
	const Authorization = req.header("Authorization")
	const getToken =
		Authorization && Authorization.split(" ")[1]

	// jika token tidak ada kita blokir acces
	if (getToken == null)
		return res
			.status(403)
			.json({
				msg: "token required, access denied"
			})

	try {
		jwt.verify(
			getToken,
			process.env.secretKey,
			(error, decode) => {
				if (error) {
					// if token expired
					res.status(403).json({
						msg: "Token is expired, try login again"
					})
				}
				req.email = decode.email
			}
		)
		next()
	} catch (error) {
		if (error) return res.sendStatus(401)
	}
}

module.exports = verifikasiToken
