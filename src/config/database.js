const sequelize = require('sequelize')
const dotenv = require('dotenv').config()

const dbName = process.env.database
const username = process.env.username
const password = process.env.password
const host = process.env.host


// hubungkan database 
const connectDb = new sequelize(dbName, username, password, {
  host: host,
  dialect: 'mysql'
})

connectDb.authenticate(() => console.log('connected to database !'))

module.exports = connectDb
