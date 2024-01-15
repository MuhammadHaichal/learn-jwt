const express = require('express')
const app = express()
const router = require('./routes/route')
const port = process.env.portServer || 4000 
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

dotenv.config()
app.use(cookieParser())
app.use(express.json())


app.use('/api/v1/', router)



app.listen(port, () => {
  console.log('server running !!!')
})