class Cell {
    constructor() {
        this.isFree = true;
        this.isCheck = false;
        this.ship = null;
        this.neighbors = {
            topRight: null,
            top: null,
            topLeft: null,
            left: null,
            bottomLeft: null,
            bottom: null,
            bottomRight: null,
            right: null
        }
    }

    setNeighbors(_side, _neighbors) {
        this.neighbors[_side] = _neighbors;
    }

    check() {
        this.isCheck = true;
    }

    bookIt(_ship) {
        if(!this.ship) {
            this.ship = _ship;
            this.isFree = false;
        }
    }
}

module.exports = Cell;