//NODE.JS REQUIREMENTS
const io = require("socket.io")
var socket;
CONNECTIONS_LIST = {};
PLAYER_LIST = {};

const Player = require("./player").Player;

exports.run = function (port) {

    socket = io.listen(port);
    socket.set("transports", ["websocket"]);

    // Start listening for events
    setEventHandlers();
}




var setEventHandlers = function () {
    // Socket.IO
    socket.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {

    const id = require('./utils/makeid.js').makeid(4);
    client.id = id;
    CONNECTIONS_LIST[id] = client;

    console.log("New player has connected: " + id);

    const player = Player(id, 250, 250, 2);
    PLAYER_LIST[client.id] = player;

    // Listen for client disconnected
    client.on("disconnect", onClientDisconnect);
}

function onClientDisconnect(client) {
    const id = client.id;
    util.log("Player has disconnected: " + id);
    delete CONNECTIONS_LIST[id]
    delete PLAYER_LIST[id]
}