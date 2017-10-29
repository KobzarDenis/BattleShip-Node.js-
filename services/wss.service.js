var WebSocket = require("ws").Server;
var wss = new WebSocket({port:9000});
var gameDispatcher = require('../modules/game');

module.exports = () => {

var freeUser = null;

wss.on("connection", (socket) => {

    socket.on('message', (msg) => {
        var content = JSON.parse(msg);
        switch(content.event) {
            case 'turn' : gameDispatcher.turn(content.gameID, content.userID, content.coordinates); break;
            case 'reconnect' : content.userID ? gameDispatcher.reconnectUser(content.userID, socket) : gameDispatcher.initUser(socket); break;
            default: break;
        }
    });
});
};