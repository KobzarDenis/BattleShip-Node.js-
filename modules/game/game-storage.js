var Game = require('./game');

class GameStorage {
    constructor() {
        this.listOfGames = [];
    }

    addGame(_firstUser, _secondUser) {
        if (_firstUser && _secondUser) {
            const gameId = (_firstUser.id + _secondUser.id).split('-').toString();
            const newGame = new Game(gameId, _firstUser, _secondUser);
            this.listOfGames.push(newGame);
            return newGame;
        }
    }

    deleteGame(_gameID) {
        const id = this.listOfGames.findIndex(g => g.id == _gameID);
        this.listOfGames.splice(id, 1);
    }
}

module.exports = new GameStorage();