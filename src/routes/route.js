const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const verifikasiToken = require('../middleware/verifikasiToken')
const RefreshToken = require('../middleware/refreshToken')
const { Login, Register } = require('../controller/users')
const { listProducts, newProducts, detailProducts } = require('../controller/products')

// BODY-PARSER SETUP    
const bodyJson = bodyParser.json()

router.get('/products', verifikasiToken, listProducts )
router.post('/products/details/:idProducts', verifikasiToken, detailProducts )
router.post('/products/new', verifikasiToken, bodyJson, newProducts )



// AUTHENTIFICATION ROUTE
router.post('/users/login', Login)
router.post('/users/register', bodyJson, Register)
router.post('/users/token', RefreshToken)

module.exports = router;
