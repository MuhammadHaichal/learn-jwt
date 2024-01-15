const products = require('../models/products');
// const parsePrice = require('../utils/parsingPrice')

const listProducts = async (req, res) => {
  try {
    const getProduct = await products.findAll({
      attributes: [
        'id',
        'productName',
        'productCategories',
        'productPrice',
        'updatedAt'
      ]
    })
    
    //  test
    const parseJsonProducts = JSON.stringify(getProduct)
    
    res.status(200).json({
      status: 200,
      msg: "ok",
      data:  parseJsonProducts,
    })
  } catch (error) {
    res.status(404).json({
      status: 404,
      msg: 'internal server err',
      msgfromServer: error
    })
  }
}

const detailProducts = async (req, res) => {
  try {
    const getIdProducts = req.params.idProducts
    const details = await products.findAll({
      attributes: ['productName', 'productCategories', 'productPrice', 'CreatedAt'],
      where: { id: getIdProducts }
    })
    
    res.status(200).json({
      status: 200,
      msg: 'ok',
      data: details
    })
    
  } catch (error) {
    res.status(404).json({
      status: 404,
      msg: 'not found this products',
      data: details
    })
  }
}

const newProducts = async (req, res) => {
  try {
    const { productName, productCategories, productPrice } = req.body
    
     
    const productCreate = await products.create({
      productName: productName,
      productCategories: productCategories,
      productPrice:  productPrice
    })
    
    res.status(201).json({
      status: 201,
      msg: 'success created product'
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  listProducts,
  newProducts,
  detailProducts
} 