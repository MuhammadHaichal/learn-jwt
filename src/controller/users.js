const TableUser = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 


// REGISTER
const Register = async (req, res)  => {
  const { nama, email, umur, address, noTelpone, password } = req.body
  
  try {
    const salt = bcrypt.genSaltSync(10)
    const HashPassword = bcrypt.hashSync(password, salt);
    
    const createUsers = await TableUser.create({
      nama: nama,
      email: email,
      umur: umur, 
      address: address,
      noTelpone: noTelpone,
      password: HashPassword
    })
    
    res.status(201).json({
      statusCode: 201,
      msg: 'berhasil created users'
    })  
  } catch (error) {
    res.sendStatus(400)
  }
}

// LOGIN  
const Login = async (req, res) => {
  
  try {
    const { nama, email, password } = req.body;
    
    // mencari email
    const users = await TableUser.findAll({
      where: { email: email }
    })
    
    // cek apakah password cocok yang ada di database
    const matchPassword = await bcrypt.compare(password, users[0].password)
    
    if(!matchPassword){
      res.status(403).json({
        statusCode: 403,
        msg: 'wrong password, try again !'
      })
    }
    
    const userId = users[0].id
    const userNama = users[0].nama
    const userEmail = users[0].email
    const accessToken = jwt.sign( { userId, userNama, userEmail }, process.env.secretKey, { 
       expiresIn: '30s'
      }
    )  
        
    const refreshToken = jwt.sign({userId, userNama, userEmail }, process.env.refreshKey, { 
        expiresIn: '1d'
      }
    )   
    
    await TableUser.update({
      refreshToken: refreshToken
    }, { 
      where : {
        id: userId
      }
    })
    
    // mengirim cookie ke client 
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    
    
    res.json({ accessToken })  
  } catch (error) {
    // jika email tidak ditemukan lempar ke not found
    res.status(404).json({msg: 'Email tidak ditemukan'})
  }
}



// REGISTER
module.exports = {
  Login,
  Register
}
