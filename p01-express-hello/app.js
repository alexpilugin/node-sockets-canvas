// 1st step: install Express.js: $ npm install
// 2nd step: launch server:  $ node app.js

var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World from Express.js!')
})

app.listen(3000, function () {
  console.log('Server started on localhost:3000; press Ctrl-C to terminate....');
})