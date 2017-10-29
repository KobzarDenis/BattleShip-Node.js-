class Ship {
    constructor(_tiers) {
        this.tiers = _tiers;
    }

    shot() {
        if(this.tiers>0) {
            this.tiers --;
            return this.tiers > 0 ? 'damaged' : 'killed';
        }
        return 'error';
    }
}

module.exports = Ship;