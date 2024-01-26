const { DataTypes } = require("sequelize")
const db = require("../config/database")

const TableProduct = db.define("products", {
	productName: {
		type: DataTypes.STRING(90),
		allowNull: false
	},

	productCategories: {
		type: DataTypes.STRING(50)
	},

	productPrice: {
		type: DataTypes.BIGINT
	}
})

// TableProduct.sync()

module.exports = TableProduct
