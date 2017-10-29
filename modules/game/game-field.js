var Cell = require('./cell');
var shipBuilder = require('./ship-position-builder');

class GameField {
    
    constructor(_id) {
        this.id = _id;
        this.square = [];
        this.initField();
        shipBuilder.setField(this);
        shipBuilder.arrangeShips();
    }

    initField() {
        for (let i = 0; i <= 9; i++) {
            let row = [];
            for (let j = 0; j <= 9; j++) {
                row.push(new Cell());
            }
            this.square.push(row);
        }
        this.neighborsChecker();
    }

    neighborsChecker() {
        for (let i = 0; i <= 9; i++) {
            for (let j = 0; j <= 9; j++) {
                this.setCellNeighbors(this.findCell({x: j, y: i}), j, i);
            }
        }
    }

    setCellNeighbors(_cell, _cellX, _cellY) {
        _sidesWheel.forEach(s => {
            _cell.setNeighbors(s.sideName, this.findCell({x : s.neigborX(_cellX), y : s.neigBorY(_cellY)}))
        });
    }

    shot(_coordinates) {
        if(_coordinates) {
            let res;
            const cell = this.findCell(_coordinates);
            if(cell && !cell.isCheck) {
                if (cell.isFree) {
                    res = 'miss';
                } else {
                    res = cell.ship.shot();
                }
                cell.check();
            } else {
                res = 'error';
            }
            return res;
        }
    }

    findCell(_coordinates) {
        const row = this.square[_coordinates.y];
        if(row) {
            return row[_coordinates.x];
        }
    }

}

const _sidesWheel = [
    {
        sideName: 'topRight',
        neigborX: (x) => { return x - 1 },
        neigBorY: (y) => { return y - 1 }
    },
    {
        sideName: 'top',
        neigborX: (x) => { return x },
        neigBorY: (y) => { return y - 1 }
    },
    {
        sideName: 'topLeft',
        neigborX: (x) => { return x + 1 },
        neigBorY: (y) => { return y - 1 }
    },
    {
        sideName: 'left',
        neigborX: (x) => { return x + 1 },
        neigBorY: (y) => { return y }
    },
    {
        sideName: 'bottomLeft',
        neigborX: (x) => { return x + 1 },
        neigBorY: (y) => { return y + 1 }
    },
    {
        sideName: 'bottom',
        neigborX: (x) => { return x },
        neigBorY: (y) => { return y + 1 }
    },
    {
        sideName: 'bottomRight',
        neigborX: (x) => { return x - 1 },
        neigBorY: (y) => { return y + 1 }
    },
    {
        sideName: 'right',
        neigborX: (x) => { return x - 1 },
        neigBorY: (y) => { return y }
    },
];

module.exports = GameField;
