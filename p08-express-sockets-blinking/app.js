//https://rainingchain.com/tutorial/nodejs
//$ node app.js
//https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen


const express = require('express');
const app = express();
const server = require('http').createServer(app);


// app.use/routes/etc...
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

const port = 2000;
server.listen(port);
console.log("Server started on port: " + port);

const SOCKET_LIST = {};
const PLAYER_LIST = {};

const Player = function (id) {
  var self = {
    x: 250,
    y: 250,
    id: id,
    deltaX: parseFloat(Math.random() * (Math.random() < 0.5 ? -1 : 1)).toFixed(2) * 2, //rndom positive or negative
    deltaY: parseFloat(Math.random() * (Math.random() < 0.5 ? -1 : 1)).toFixed(2) * 2, //parseFloat("123.456").toFixed(2);
    pressingRight: false,
    pressingLeft: false,
    pressingUp: false,
    pressingDown: false,
  }
  self.updatePosition = function () {
    const speed = 2;
    if (self.pressingRight) self.deltaX -= speed;
    if (self.pressingLeft) self.deltaX += speed;
    if (self.pressingUp) self.deltaY += speed;
    if (self.pressingDown) self.deltaY -= speed;
  }
  return self;
}

//https://nodesource.com/blog/understanding-socketio/

const io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {
  console.log('\n\nMsg from Server: "socket connection"');

  socket.id = require('./helper/helper.js').makeid(4);
  SOCKET_LIST[socket.id] = socket;

  const player = Player(socket.id);
  PLAYER_LIST[socket.id] = player;

  for (var i in PLAYER_LIST) {
    console.log(PLAYER_LIST[i].id + ' (deltaX: ' + PLAYER_LIST[i].deltaX + ' deltaY: ' + PLAYER_LIST[i].deltaY + ')');
  }

  socket.on('keyPress', function (data) {
    if (data.inputId === 'left') {
      player.pressingLeft = data.state;
    }
    if (data.inputId === 'right') {
      player.pressingRight = data.state;
    }
    if (data.inputId === 'up') {
      player.pressingUp = data.state;
    }
    if (data.inputId === 'down') {
      player.pressingDown = data.state;
    }
    //console.log("keyPressed: " + data.inputId)
  })

  socket.on('disconnect', function (socet) {
    delete SOCKET_LIST[socket.id];
    delete PLAYER_LIST[socket.id];
    //clearInterval(interval);
  })


  const interval = setInterval(function () {

    var pack = [];

    for (var i in PLAYER_LIST) {
      var player = PLAYER_LIST[i];

      if (player.pressingDown ||
        player.pressingUp ||
        player.pressingLeft ||
        player.pressingRight) {

        player.updatePosition();
      }

      player.x += player.deltaX;
      player.y += player.deltaY;

      if (player.x > 500 || player.x < 0) {
        player.deltaX = -player.deltaX;
      }

      if (player.y > 500 || player.y < 0) {
        player.deltaY = -player.deltaY;
      }


      pack.push({
        id: player.id,
        x: player.x,
        y: player.y,
      });

      for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i]
        socket.emit('newPositions', pack)
      }

    }
  }, 1000 / 25) //25 FPS



  socket.on('addPlayer', function () {
    const id = require('./helper/helper.js').makeid(4);

    const player = Player(id);
    PLAYER_LIST[id] = player;

    console.log('added: ' + player.id + ' (deltaX: ' + player.deltaX + ' deltaY: ' + player.deltaY + ')');
  })


  socket.on('removePlayer', function () {

    var keys = []; //a list of associative array keys
    for (var key in PLAYER_LIST) {
      if (PLAYER_LIST.hasOwnProperty(key)) {
        keys.push(key);
      }
    }

    if (keys.length > 1) {
      console.log('removed: ' + PLAYER_LIST[keys[keys.length - 1]].id);
      delete PLAYER_LIST[keys[keys.length - 1]] //delete last one
    }

  })


});







