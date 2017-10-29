class User {
    constructor(_id, _socket) {
        this.id  = _id;
        this.socket = _socket;
        this.field = null;
        this.hp = 20;
    }

    say(data) {
        this.socket.send(JSON.stringify(data));
    }

    setField(_field) {
        if(_field) {
            this.field = _field;
        }
    }

}

module.exports = User;