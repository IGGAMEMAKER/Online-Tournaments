var Gifts = require('./gifts')

Gifts.all({})
.then(console.log)
.catch(console.error)