const db  = require('../config/database')
const { DataTypes } = require('sequelize')

// CREATE TABLE   
const TableUsers = db.define('users', {
  'nama': {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notNull : {
        msg: 'Please enter your name'
      }
    }
  },
  'email': {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    }
  },
  'password': {
    type: DataTypes.TEXT,
  },
  'refreshToken' : {
    type: DataTypes.TEXT
  },
  'umur': {
    type: DataTypes.INTEGER(2),
    allowNull: false,
    validate: {
      notNull : {
         msg: 'Please enter your umur'
      },
      isNumeric: true // mengecek hanya angka yang boleh di input
    }
  },
  'address': {
    type: DataTypes.TEXT('medium'),
    allowNull: false,
    validate: {
      notNull : {
         msg: 'Please enter your address'
      },
    }
  },
  'noTelpone': {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    validate: {
       isNumeric: true,
       notNull : {
         msg: 'Please enter your phone number'
      },
    }
  },
})



// TableUsers.sync({ force: true  });
  

module.exports = TableUsers

