const TableUser = require('../models/users')
const jwt = require('jsonwebtoken')

const RefreshToken = async (req, res) => {
  try {
    const getTokenCookie = req.cookies.refreshToken
    
    // jika tidak ada refreshToken di cookie
    if(!getTokenCookie) return res.sendStatus(404)
    
    const users = await TableUser.findAll({
      where: {
        // membandingkan refreshToken yang ada di Db dengan refreshToken cookie
        refreshToken: getTokenCookie
      }
    })
    
    // jika tidak ditemukan users bedasarkan refresh token
    if(!users[0]) return res.sendStatus(403)
    
    jwt.verify(getTokenCookie, process.env.refreshKey, function(error, decode) {
      if(error) return res.sendStatus(403)
       
      const userId = users[0].id
      const userNama = users[0].nama
      const userEmail = users[0].email
      
      // created new token 
      const accessToken = jwt.sign({userId, userNama, userEmail}, process.env.secretKey, {
        expiresIn: '30s'
      })
        
      // send to client
       res.json({
         accessToken
       })
    })
    
  } catch (error) {
    console.log(error)
  }

}

module.exports = RefreshToken