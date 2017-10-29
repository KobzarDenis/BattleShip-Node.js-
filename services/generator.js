class Generator {

    guid() {
        const guid = (this.S4() + this.S4() + "-" + this.S4() + "-4" + this.S4().substr(0,3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();
        return guid;
     };

     S4() {
         return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
     };

    randomNumber(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }
}

module.exports = new Generator();