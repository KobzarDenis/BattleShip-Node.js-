var gameStorage = require('./game-storage');
var setShips = require('../mock/mockFields');
var generator = require('../../services/generator');
var User = require('../user/user');

class GameDispatcher {
    constructor() {
        this.gameStorage = gameStorage;
        this.freeUser = null;
    }

    initUser(_socket) {
        let newUser = new User(generator.guid(), _socket);
        const message = {
            event: 'connected',
            status : 'wait_for_oponent',
            id : newUser.id
        }
        this.sender([newUser], message);
        this.initNewGame(newUser);
    }

    initNewGame(_user) {
        if(this.freeUser){
            this.createNewGame(this.freeUser,  _user);
            this.freeUser = null;
        } else {
            this.freeUser = _user;
        }
    }

    createNewGame(_firstUser, _secondUser) {
        const newGame = this.gameStorage.addGame(_firstUser, _secondUser);
        if (newGame) {
            this.startGame(newGame);
        }
    }

    turn(_gameID, _userID, _coordinates) {
        if (_gameID && _userID && _coordinates) {
            const game = this.gameStorage.listOfGames.find(g => g.id == _gameID);
            if (game) {
               const res = game.turn(_userID, _coordinates);
               res.nextTurn!= 'game_over' ? this.sender(game.users, res) : this.endGame(game);
            }
        }
    }

    fieldsConverter(field) {
        const square = [];
        field.square.forEach(r => {
            const arr = [];
            r.forEach(c => {
                const cell = {isFree : c.isFree, isCheck : c.isCheck};
                arr.push(cell);
            });
            square.push(arr);
        });
        return square;
    }
    
    sender(_users, _data) {
        _users.forEach(u => {
            u.say(_data);
        });
    }

    startGame(_game) {
        let message = {
            event : 'game_start',
            gameID : _game.id,
            firstShot: _game.users[generator.randomNumber(0, 1)].id
        }
        for(let i=0; i<2; i++) {
            const fields = this.getFields(_game ,_game.users[i]);
            message.myField = fields[0];
            message.oponentField = fields[1];
            _game.users[i].say(message);
        }
    }

    getFields(_game, _user) {
        let fields = [];
        fields.push(this.fieldsConverter(_user.field));
        fields.push(this.fieldsConverter(_game.users.find(u => u.id != _user.id).field));
        return fields;
    }

    endGame(_game) {
        let message = {
            event : 'game_over'
        };
        message.winner = _game.users[0].hp > 0 ? _game.users[0].id : _game.users[1].id;
        this.sender(_game.users, message);
        this.gameStorage.deleteGame(_game);
    }

    reconnectUser(_userID, _socket) {
        let isFind = false;
        const message = {
            event : 'reconnect',
            userID : _userID
        }
        this.gameStorage.listOfGames.forEach(g => {
            const user = g.users.find(u => u.id == _userID);
            if (user) {
                const fields = this.getFields(g, user);
                message.gameID = g.id;
                message.nextTurn = g.nextTurn;
                message.myField = fields[0];
                message.oponentField = fields[1]; 
                user.socket = _socket;
                user.say(message);
                isFind = true;
            }
        });
        if(!isFind) {
            this.initNewGame(new User(_userID, _socket));
        }
    }

}

module.exports = new GameDispatcher();