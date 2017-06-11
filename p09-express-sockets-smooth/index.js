const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io').listen(server);


const idmaker = require('./required/server/utils/idmaker.js');
const Player = require('./required/server/player.js').Player;

CONNECTIONS_LIST = {};
PLAYER_LIST = {};

//https://socket.io/get-started/chat/
// app.use/routes/etc...
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/required/client/index.html');
});

// static resources for public access
app.use(express.static(__dirname + '/required/client/'));

app.use(function (req, res, next) {
  const msg = 'ERROR 404: "' + req.url + '" - Not found.';
  console.log(msg);
  res.status(404);
  res.send(msg);
});

const port = 2000;
server.listen(port, function () {
  console.log("Server started on port: " + port);
});



io.on('connection', function (client) {

  // New socket connection
  onFirstConnection(client);

  // Listen for client disconnected
  client.on("disconnect", onClientDisconnect);

  //update players
  client.on("request_update", onPlayerUpdate);

  //add a new player
  client.on("request_addPlayer", addPlayer);

  //remove last player
  client.on("request_removeLastPlayer", removeLastPlayer);
});


function onFirstConnection(client) {
  const id = idmaker.makeid(4)
  client.id = id;

  var newPlayer = Player(id, 250, 250);
  newPlayer.setColor("red");

  CONNECTIONS_LIST[id] = client;
  PLAYER_LIST[id] = newPlayer;

  //console.log(PLAYER_LIST[id]);

  sendTextMsg("New player has connected: " + id);
  console.log("New player has connected: " + id);

  onPlayerUpdate();
}

function addPlayer() {
  const id = idmaker.makeid(4);
  const newPlayer = Player(id, 250, 250);
  newPlayer.setColor("blue");
  PLAYER_LIST[id] = newPlayer;

  console.log("New player was added: " + id);
  sendTextMsg("New player was added: " + id);
}

function removeLastPlayer() {

  var keys = []; //a list of associative array keys
  for (var key in PLAYER_LIST) {
    if (PLAYER_LIST.hasOwnProperty(key)) {
      keys.push(key);
    }
  }

  var amountConnections = 0;
  var socketsIDs = []
  for (var key in CONNECTIONS_LIST) {
    if (CONNECTIONS_LIST.hasOwnProperty(key)) {
      socketsIDs.push(CONNECTIONS_LIST[key].id);
      amountConnections++;
    }
  }

  if (keys.length > socketsIDs.length) {

    const lastPlayerID = keys[keys.length - 1];
    var found = false;
    for (var i = 0; i < socketsIDs.length; i++) {
      if (lastPlayerID === socketsIDs[i]) found = true;
    }
    if (!found) {
      delete PLAYER_LIST[lastPlayerID] //delete last one    
      console.log('removed: ' + lastPlayerID);
      sendTextMsg('removed: ' + lastPlayerID);
    }

  }
}


// Socket client has disconnected
function onClientDisconnect() {
  console.log("Player has disconnected: " + this.id);
  sendTextMsg("Player has disconnected: " + this.id);
  const id = this.id;
  delete CONNECTIONS_LIST[id];
  delete PLAYER_LIST[id];
}

function sendTextMsg(msg) {
  for (var i in CONNECTIONS_LIST) {
    var socket = CONNECTIONS_LIST[i]
    socket.emit('server_text_msg', msg)
  }
}


function onPlayerUpdate() {
  //console.log('update request received from: ' + this.id);
  const id = this.id;

  var pack = [];
  for (var i in PLAYER_LIST) {
    var player = PLAYER_LIST[i];

    player.update();

    if (player.x > 500) {
      player.x = 500;
      player.dx = -player.dx;
    }

    if (player.x < 0) {
      player.x = 0;
      player.dx = -player.dx;
    }

    if (player.y < 0) {
      player.y = 0;
      player.dy = -player.dy;
    }

    if (player.y > 500) {
      player.y = 500;
      player.dy = -player.dy;
    }

    pack.push({
      id: player.id,
      x: player.x,
      y: player.y,
      color: player.color
    });

    for (var i in CONNECTIONS_LIST) {
      var socket = CONNECTIONS_LIST[i]
      socket.emit('responce_new_positions', pack)
    }

  }
}