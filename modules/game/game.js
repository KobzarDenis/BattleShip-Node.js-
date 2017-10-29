var GameField = require('./game-field');

class Game {
    constructor(_id, _firstPlayer, _seccondPlayer) {
        this.id = _id;
        this.users = this.initPlayers([_firstPlayer, _seccondPlayer]);
        this.nextTurn = '';
    }

    initPlayers(_players) {
        if(_players) {
            let arr = [];
            _players.forEach(p => {
                p.setField(new GameField(p.id));
                arr.push(p);
            });
            return arr;
        }
    }

    turn(_userID, _coordinates) {
        if(_userID && _coordinates) {
           const user = this.users.find(u => u.id != _userID);
           if (user) {
               const res = user.field.shot(_coordinates);
               return this.result(res, _coordinates, _userID, user);
           } else {
               return null; // Exception
           }
        }
    }


    // Generate response for clients

    result(_res, _coordinates, _firedUser, _victimUser) {
        let response = {};
        response.event = 'turn';
        response.coordinates = _coordinates;
        response.shotResult = _res;
        if (_res== 'damaged' || _res=='killed') {
            _victimUser.hp --;
            _victimUser.hp > 0 ? this.nextTurn = _firedUser : this.nextTurn = 'game_over';
        } else {
            this.nextTurn = _victimUser.id;
        }
        response.nextTurn = this.nextTurn;
        response.firedUser = _firedUser;
        return response;
    }

}

module.exports = Game;