const TableUser = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 
const usersValidate = require('../validation/usersValidation')



// REGISTER
const Register = async (req, res)  => {
    const { nama, email, umur, address, noTelpone, password } = req.body
      
    try {
        
        //  validation users inputed
        const { error, value } = usersValidate.validate({
            'nama': nama, 
            'email': email,
            'address': address, 
            'password': password
        })
            
        
        // if users send data not valid
        if (error) {
            return error.details.map((data) => {
                res.json({
                    code: 400,
                    errors: data.message,
                    message: ''
                })
            })
        } 
        
        
        if(!error) {
            const salt = bcrypt.genSaltSync(10)
            const HashPassword = bcrypt.hashSync(value.password, salt);
            const createUsers = await TableUser.create({
              nama: value.nama,
              email: value.email,
              umur: umur, 
              address: value.address,
              noTelpone: noTelpone,
              password: HashPassword
            })
            return res.sendStatus(201)
        }
        
    } catch (error) {
        // if user already usage 
        if (error) {
            error.errors.map((data) => {
                return res.json({
                    code: 400,
                    errors: data.message,
                    message: ''
                })
            })
        } else {
            return
        }
    }
}

// LOGIN  
const Login = async (req, res) => {
  
  try {
    const { nama, email, password } = req.body;
    
    // search email 
    const users = await TableUser.findAll({
      where: { email: email }
    })
    
    // cek apakah password cocok yang ada di database
    const matchPassword = await bcrypt.compare(password, users[0].password)
    
    // if password wrong
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
    
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    
    res.json({ accessToken })  
    
  } catch (error) {
    // if email not found
    res.status(404).json({msg: 'Sory Email Not Found'})
  }
}

const Logout = async (req, res) => {
   const tokenCookie = req.cookies.refreshToken
  
  // if cookie not found
  if(!tokenCookie) return res.sendStatus(401)
    
  const users = await TableUser.findAll({
    where: {
     refreshToken: tokenCookie
    }
  })
    
  //  if user not match refreshToken
  if(!users) return res.sendStatus(401)
  
  const userId = users[0].id
  await TableUser.update({ refreshToken: null },
    { where: { id : userId } 
  })  
  
  // remove cookie 
  res.clearCookie('refreshToken')
  return res.sendStatus(200)
}


// REGISTER
module.exports = {
  Login,
  Register,
  Logout
}
