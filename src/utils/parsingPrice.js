function parsePrice (price) {
   return console.log(new Intl.NumberFormat('en-US').format(price));
}

module.exports = parsePrice