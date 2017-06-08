// 1st step: install Express.js: $ npm install
// 2nd step: launch server:  $ node app.js

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

serv.listen(3000);

console.log('Server started on localhost:3000; press Ctrl-C to terminate....');
