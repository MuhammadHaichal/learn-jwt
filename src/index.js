const express = require("express")
const app = express()
const router = require("./routes/route")
const port = process.env.portServer || 4001
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const cors = require("cors")

// configuration middleware
dotenv.config()
app.use(cookieParser())
app.use(express.json())
app.use(cors({ origin: "http://localhost:3000/" }))

// route for api service
app.use("/api/v1/", router)

app.listen(port, () => {
	console.log(
		`server running at http://localhost:${port}`
	)
})
