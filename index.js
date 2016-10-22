var express = require('express');
var app = express();
var url = require('url');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var connected_users = [];


console.log('hi there');

var rooms = [new room(),new room(),new room(),
             new room(),new room(),new room(),
             new room(),new room(),new room(),
             new room()]; // Use 1-9

function room() {
  this.viewers = [];
  this.playerId = {O:'', X:''};
  this.playerName = {O:'', X:''};
  this.playerScore = {O:0, X:0};
  this.grid = [];
  this.turn = ''; // X or O
  this.startingPlayer = ''; // X or O
  this.pauseplay = false;
}



function initialiseRoom(room) {

}

function resetBoard(room) {

}

function otherShape(shape) {
  if (shape === 'O') {
    return 'X';
  }
  else if (shape === 'X') {
    return 'O';
  }
  else {
    return '';
  }
}

io.on('connection', function(socket){
  var playerId = socket.id;
  var playerName = "";
  var playerRoom = 0;
  var playerShape = "";
  var playerScore = 0;


  socket.on('clickOnRoom', function(roomId){
    if (roomId >= 1 && roomId <=9) {
      rooms[roomId].viewers.push(playerId);
      io.emit('goIntoRoom', room[roomId]);
      playerRoom = roomId;
    }
  });

  socket.on('clickOnPlayerShape', function(shape){
    previousShape = playerShape;
    // if O or X available
    // assign player to room shape
    if (playerShape !== shape && (shape == 'X' || shape == 'O') && playerRoom!==0) {
      if (rooms[playerRoom].playerId[shape] === "") {
        playerShape = shape;
        rooms[playerRoom].playerId[shape] = playerId;

        if (previousShape !== '' && previousShape === otherShape(shape)) {
          // remove player from shape
          rooms[playerRoom].playerId[previousShape] = '';
          rooms[playerRoom].playerName[previousShape] = '';
          rooms[playerRoom].playerScore[previousShape] = 0;
          rooms[playerRoom].grid = [];
          // transmit to all other players and reset
          io.emit('resetRoom', room[playerRoom]); // not written in main code yet
        }

        // check if user already has a username
        if (playerName === "") {
          socket.emit('activateShapePromptUsernameInput', shape);
        }
        else {
          rooms[playerRoom].playerName[playerShape] = playerName;
          // broadcast username
        }
      }
      else {
      // if not available
      // send info to user that room is not available
        // io.emit('shapeNotAvailable', shape);
      }
    }

    if (rooms[playerRoom].playerId.X !== '' && rooms[playerRoom].playerId.O !== '') {
        rooms[playerRoom].grid = [];
        if (Math.random() < 0.5) {
          rooms[playerRoom].turn = 'X';
          rooms[playerRoom].startingPlayer = 'X';
        }
        else {
          rooms[playerRoom].turn = 'O';
          rooms[playerRoom].startingPlayer = 'O';
        }
        // broadcast turn
        io.emit('displayTurn', rooms[playerRoom].turn);
    }
    // rooms[playerRoom].turn = 'hi';

  });

  socket.on('usernameInput', function(username){
    if (playerRoom >= 1 && playerRoom <=9 &&
        (playerShape == 'X' || playerShape == 'O') )  {
      playerName = username;
      rooms[playerRoom].playerName[playerShape] = username;
      // broadcast username
    }

  });

  socket.on('clickOnAGrid', function(gridId){
    if (rooms[playerRoom].pauseplay === false && gridId>= 0 && gridId<=8) {
      // check if user is a player in the room
      // check if it's users' turn
      // check if grid is empty

      if (rooms[playerRoom].playerId.X !== '' && rooms[playerRoom].playerId.O !== '') {
        //check if the player is in the room
        if (rooms[playerRoom].turn === playerShape) {
          if (rooms[playerRoom].grid[gridId] === undefined) {
            rooms[playerRoom].grid[gridId] = playerShape;
            // if yes then place grid and shape
            io.emit('placeGrid', [gridId,playerShape]);
            rooms[playerRoom].turn = otherShape(rooms[playerRoom].turn);
            io.emit('displayTurn', rooms[playerRoom].turn);
          }
        }

        g = rooms[playerRoom].grid;

        if ( (g[0] === g[1] && g[1] === g[2] && g[2] === playerShape) || (g[3] === g[4] && g[4] === g[5] && g[5] === playerShape) || 
             (g[6] === g[7] && g[7] === g[8] && g[8] === playerShape) || (g[0] === g[3] && g[3] === g[6] && g[6] === playerShape) || 
             (g[1] === g[4] && g[4] === g[7] && g[7] === playerShape) || (g[2] === g[5] && g[5] === g[8] && g[8] === playerShape) || 
             (g[0] === g[4] && g[4] === g[8] && g[8] === playerShape) || (g[2] === g[4] && g[4] === g[6] && g[6] === playerShape) ) {
          // check if player win
          io.emit('player win', playerShape);
          // reset room
          playerScore++;
          rooms[playerRoom].playerScore[playerShape]++;
          io.emit('score update', rooms[playerRoom].playerScore);
          rooms[playerRoom].grid = [];
          rooms[playerRoom].startingPlayer = otherShape(rooms[playerRoom].startingPlayer);
          rooms[playerRoom].turn = rooms[playerRoom].startingPlayer;
          // transmit to all other players and reset
          rooms[playerRoom].pauseplay = true;
          setTimeout(function() {
            io.emit('resetRoom', ''); // only to viewers of this room
            rooms[playerRoom].pauseplay = false;
            io.emit('displayTurn', rooms[playerRoom].turn);
          }, 1000);
        }
      }
    }

  });

  socket.on('exitRoom', function(empty){
    // remove player from room
    if (playerShape == 'X' || playerShape == 'O') {
      // remove player from shape
      rooms[playerRoom].playerId[playerShape] = '';
      rooms[playerRoom].playerName[playerShape] = '';
      rooms[playerRoom].playerScore[playerShape] = 0;
      rooms[playerRoom].grid = [];
      rooms[playerRoom].startingPlayer = '';
      rooms[playerRoom].turn = '';
      io.emit('displayTurn', rooms[playerRoom].turn);
      // transmit to all other players and reset
      socket.broadcast.emit('resetRoom', room[playerRoom]); // not written in main code yet
    }

    for (var i = 0; i < rooms[playerRoom].viewers.length; i++) {
      if (rooms[playerRoom].viewers[i] === playerId) {
        rooms[playerRoom].viewers.splice(i, 1);
      }
    }

    playerRoom = 0;
    playerShape = "";
    playerScore = 0;


  });


  socket.on('disconnect', function() {
    // remove player from room
    if (playerShape == 'X' || playerShape == 'O') {
      // remove player from shape
      rooms[playerRoom].playerId[playerShape] = '';
      rooms[playerRoom].playerName[playerShape] = '';
      rooms[playerRoom].playerScore[playerShape] = 0;
      rooms[playerRoom].grid = [];
      rooms[playerRoom].startingPlayer = '';
      rooms[playerRoom].turn = '';
      io.emit('displayTurn', rooms[playerRoom].turn);
      // transmit to all other players and reset
      io.emit('resetRoom', room[playerRoom]); // not written in main code yet
    }

    for (var i = 0; i < rooms[playerRoom].viewers.length; i++) {
      if (rooms[playerRoom].viewers[i] === playerId) {
        rooms[playerRoom].viewers.splice(i, 1);
      }
    }

    playerRoom = 0;
    playerShape = "";
    playerScore = 0;
    
  });

  socket.on('retrieveServerInfo', function(empty) {
    var data = [rooms, playerId, playerName, playerRoom, playerShape];
    socket.emit('retrieveServerInfo', data);
  });
});




server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

app.get('/*', function(req, res){
    if(chats[req.url.substring(1)]){
        res.sendFile(__dirname + '/public/chat.html');
    }else{
        res.sendFile(__dirname + '/public/404.html');
    }
});