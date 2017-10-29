var generator = require('../../services/generator');
var Ship = require('./ship');

class ShipPositionBuilder {
    constructor() {
        this.ships;
        this.field;
        this.vectors = ['top', 'left', 'bottom', 'right'];
    }

    setField(_field) {
        this.field = _field;
        this.ships = this.createShips();
    }

    createShips() {
        var ships = [];
        let arr;
        for (let i = 1; i <= 4; i++) {
            arr = [];
            for (let j = i; j <= 4; j++) {
                arr.push(new Ship(i))
            }
            ships.push(arr);
        }
        return ships;
    };

    arrangeShips() {
        let subdivision;
        while (true) {
            if (this.ships[0].length <= 0 && this.ships[1].length <= 0 && this.ships[2].length <= 0 && this.ships[3].length <= 0) {
                break;
            } else {
                subdivision = generator.randomNumber(0, 3);
                if (this.ships[subdivision].length > 0) {
                    this.shipPositionBuilder(this.ships[subdivision][0]);
                    this.deleteShip(this.ships[subdivision]);
                }
            }
        }
    }

    shipPositionBuilder(_ship) {
        let cells = this.findPlace(_ship.tiers);
        if (cells) {
            cells.forEach(c => {
                c.bookIt(_ship);
            });
        }
    }

    findPlace(_shipTiers) {
        const cell = this.checkCell();
        const cells = this.passagThroughCells(cell, _shipTiers, 0);
        if (!cells || cells.length != _shipTiers) {
            return this.findPlace(_shipTiers);
        } else {
            return cells;
        }
    }

    deleteShip(_arr) {
        _arr.splice(0, 1);
    }

    checkCell() {
        const coords = this.getRandomCoordinates();
        const cell = this.field.findCell(coords);
        if (cell && cell.isFree && this.isLonelyCell(cell)) {
            return cell;
        } else {
            this.checkCell();
        }
    }

    checkCellFreeNeighbors(_cell) {
        let freeNeighbors = {};
        if (_cell) {
            for (let key in _cell.neighbors) {
                const neighbor = _cell.neighbors[key];
                if (neighbor) {
                    if (neighbor.isFree) {
                        freeNeighbors[key] = neighbor;
                    }
                } else {
                    freeNeighbors[key] = neighbor;
                }
            }
        }
        return freeNeighbors;
    }

    passagThroughCells(_cell, _count, _vector) {
        if (_vector < 4) {
            let cells = [];
            const mainCell = _cell;
            const vector = this.vectors[_vector];
            for (let i = 0; i <= _count; i++) {
                if (_cell) {
                    const n = _cell.neighbors[vector];
                    if (n) {
                        if (this.isLonelyCell(n)) {
                            cells.push(n);
                            _cell = n;
                        }
                    }
                }
            }
            if (cells.length == _count) {
                return cells;
            } else {
                return this.passagThroughCells(mainCell, _count, _vector + 1);
            }
        }
    }

    isLonelyCell(_cell) {
        return (Object.keys(this.checkCellFreeNeighbors(_cell)).length == 8);
    }

    getRandomCoordinates() {
        let coordinates = {
            x: generator.randomNumber(0, 9),
            y: generator.randomNumber(0, 9)
        };
        return coordinates;
    }
}

module.exports = new ShipPositionBuilder();