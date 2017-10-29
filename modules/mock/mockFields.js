var Field = require('../game/game-field');
var Ship = require('../game/ship');

function createShips() {
    var ships = [];
    let arr;
    for(let i=1; i<=4; i++) {
        arr = [];
        for(let j=i; j<=4; j++) {
            arr.push(new Ship(i))
        }
        ships.push(arr);
    }
    return ships;
};

function setPositionShips() {
    var field = new Field().square;
    const ships = createShips();
    field[0][0].bookIt(ships[0][0]);
    field[0][2].bookIt(ships[0][1]);
    field[0][4].bookIt(ships[0][2]);
    field[0][6].bookIt(ships[0][3]);

    field[0][8].bookIt(ships[1][0]);
    field[0][9].bookIt(ships[1][0]);
    field[2][0].bookIt(ships[1][1]);
    field[2][1].bookIt(ships[1][1]);
    field[2][3].bookIt(ships[1][2]);
    field[2][4].bookIt(ships[1][2]);

    field[2][6].bookIt(ships[2][0]);
    field[2][7].bookIt(ships[2][0]);
    field[2][8].bookIt(ships[2][0]);
    field[4][0].bookIt(ships[2][1]);
    field[4][1].bookIt(ships[2][1]);
    field[4][2].bookIt(ships[2][1]);

    field[4][4].bookIt(ships[3][0]);
    field[4][5].bookIt(ships[3][0]);
    field[4][6].bookIt(ships[3][0]);
    field[4][7].bookIt(ships[3][0]);

    return field;
}

module.exports = () => {
    return setPositionShips();
};