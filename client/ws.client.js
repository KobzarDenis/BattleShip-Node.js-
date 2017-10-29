var ID;
var socket;
var gameID;
var oponentField;
var myField;
var canIShot = false;
var myFieldView;
var oponentFieldView;

window.onload = function () {
    myFieldView = document.getElementById('my-field').children;
    oponentFieldView = document.getElementById('oponent-field').children;
    clearBattleField();
    socket = new WebSocket("ws://localhost:9000/");
    socket.onopen = onClientOpened;
    socket.onmessage = onClientMessage;
};

function onClientOpened() {
    ID = sessionStorage.getItem("ID");
    const message = {
        event : "reconnect",
        userID : ID
    };
    sendMsg(message);
}

function onClientMessage(event) {
    var content = JSON.parse(event.data);

    switch (content.event) {
        case "connected": connected(content.id); break;
        case "game_start": gameStart(content.gameID, content.myField, content.oponentField, content.firstShot); break;
        case "turn": checkShot(content.firedUser, content.shotResult, content.coordinates, content.nextTurn); break;
        case  "game_over" : gameOver((content.winner==ID)); break;
        case "reconnect" : reconnect(content.myField, content.oponentField, content.gameID, content.nextTurn); break;
        default: break;
    }
}

function connected(_id) {
    ID = _id;
    sessionStorage.setItem("ID", ID);
    console.log("Connected  " + ID);
}

function gameStart(_gameID, _myField, _oponentField, _firstShot) {
    gameID = _gameID;
    initFields(_myField, _oponentField);
    canIShot = (_firstShot == ID);
    canIShot ? alert('Game started! Is your turn!') : alert('Game started!');
}

function reconnect(_myField, _oponentField, _gameID,  _nextTurn) {
    gameID = _gameID;
    canIShot = (_nextTurn == ID);
    initFields(_myField, _oponentField);
}

function initFields(_myField, _oponentField) {
    myField = _myField;
    oponentField = _oponentField;
    parseField(_myField, myFieldView);
    parseField(_oponentField, oponentFieldView, true);
};

function parseField(_fieldData, _fieldView, _oponent = false) {
    for (var i = 0; i < 10; i++) {
        var rowView = _fieldView[i].children;
        var rowData = _fieldData[i];
        for (var j = 0; j < 10; j++) {
            const cell = rowData[j];
            if (!cell.isFree && !cell.isCheck && !_oponent) {
                rowView[j].style.backgroundColor = '#16a37a';
            } else if (!cell.isFree && cell.isCheck) {
                rowView[j].style.backgroundColor = '#eb436b';
            } else if(cell.isFree && cell.isCheck) {
                rowView[j].style.backgroundColor = '#3084b8';
            }
            if(_oponent) {
                addShotListener(rowView[j], j, i);
            }
        }
    }
}

function addShotListener(el, x, y) {
    el.addEventListener('click', () => {
        turn(y, x)
    });
}

function checkShot(_firedUser, _result, _coordinates, _nextTurn) {
    canIShot = (_nextTurn == ID);
    let checkedCell;
    if(_firedUser!=ID) {
        checkedCell = findCell(_coordinates);
        if(_result=='miss') {
            checkedCell.style.backgroundColor = '#3084b8';
        } else {
            checkedCell.style.backgroundColor = '#eb436b';
        }
    } else {
        checkedCell = findCell(_coordinates, true);
        if(_result=='miss') {
            checkedCell.style.backgroundColor = '#3084b8';
        } else {
            checkedCell.style.backgroundColor = '#eb436b';
        }
    }
}

function findCell(_coordinates, _oponent = false) {
    if(!_oponent) {
        return myFieldView[_coordinates.y].children[_coordinates.x];
    } else {
        return oponentFieldView[_coordinates.y].children[_coordinates.x];
    }
}

function turn(_y, _x) {
    if (canIShot) {
        if (!oponentField[_y][_x].isCheck) {
            var _coordinates = {
                y: _y,
                x: _x
            }
            var message = {
                event: 'turn',
                userID: ID,
                gameID: gameID,
                coordinates: _coordinates
            }
            oponentField[_y][_x].isCheck = true;
            sendMsg(message);
        } else {
            alert('This cell was been checked! Please try aggain!');
        }
    } else {
        alert("It's not your turn!");
    }
}

function gameOver(_win) {
    let str;
    str = _win ? "Congratulation! You're winner!" : "Sorry, but you're losse... Try aggain!";
    alert(str);
    clearBattleField();
}

function clearBattleField() {
    myField = null;
    oponentField = null;
    const arr = [myFieldView, oponentFieldView];
    arr.forEach(f => {
        for(let i=0; i<=9; i++) {
            let row = f[i].children;
            for(let j=0; j<=9; j++) {
                row[j].style.backgroundColor = '#1d233b';
            }
        }
    });
}

function sendMsg(message) {
    socket.send(JSON.stringify(message));
}