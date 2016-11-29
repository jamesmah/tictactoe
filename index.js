var express = require('express');
var app = express();
var url = require('url');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var rooms = [];
for (var i = 0; i <= 9; i++) {
  rooms[i] = new room();
}

function room() {
  this.playerId = {O:'', X:''};
  this.playerScore = {O:0, X:0};
  this.grid = [];
  this.turn = ''; // X or O
  this.startingPlayer = ''; // X or O
  this.gamestart = false;
}

io.on('connection', function(socket){
  // get users roomId
  socket.emit('roomId request', {});

  socket.on('add user', function (data) {
    socket.roomId = data.roomId;
    socket.join(socket.roomId);
    socket.emit('room data', rooms[socket.roomId]);
  });

  socket.on('disconnect', function() {
    removePlayer(0);
    removePlayer(1);
  });

  socket.on('shape select', function(data){
    var shape = idToShape(data.shapeId);
    // check if not succesfully removed player
    if (!removePlayer(data.shapeId)) {
      addPlayer(data.shapeId);
    }
  });

  socket.on('grid select', function(data){

    var gridId =  data.gridId;

    if (rooms[socket.roomId].gamestart === true && gridId>= 0 && gridId<=8) {
      // check if user is a player in the room
      // check if it's users' turn
      // check if grid is empty

      if (rooms[socket.roomId].gamestart && isTurn(rooms[socket.roomId].turn) && placeGrid(gridId)) {

        g = rooms[socket.roomId].grid;
        shape = rooms[socket.roomId].turn;

        var gridComplete = true;

        for(var i = 0; i < 9; i++){
          if (g[i] === undefined) {
            gridComplete = false;
          }
        }

        // If there is a winning combination
        if ( (g[0] === g[1] && g[1] === g[2] && g[2] === shape) || 
             (g[3] === g[4] && g[4] === g[5] && g[5] === shape) || 
             (g[6] === g[7] && g[7] === g[8] && g[8] === shape) || 
             (g[0] === g[3] && g[3] === g[6] && g[6] === shape) || 
             (g[1] === g[4] && g[4] === g[7] && g[7] === shape) || 
             (g[2] === g[5] && g[5] === g[8] && g[8] === shape) || 
             (g[0] === g[4] && g[4] === g[8] && g[8] === shape) || 
             (g[2] === g[4] && g[4] === g[6] && g[6] === shape) ) {

          io.in(socket.roomId).emit('player win', {shape: shape});
          rooms[socket.roomId].playerScore[shape]++;
          io.in(socket.roomId).emit('score update', {
            score: rooms[socket.roomId].playerScore[shape],
            shapeId: shapeToId(rooms[socket.roomId].turn)
          });
          nextGame();
        }
        // There's no moves left
        else if(gridComplete) {
          io.in(socket.roomId).emit('player draw', {});
          nextGame();
        }
        // Play next turn
        else {
          rooms[socket.roomId].turn = otherShape(rooms[socket.roomId].turn);
          io.in(socket.roomId).emit('game turn', {
            turn: rooms[socket.roomId].turn
          });
        }
      }
    }
  });

  function removePlayer(shapeId) {
    var shape = idToShape(shapeId);

    if (rooms[socket.roomId].playerId[shape] === socket.id) {
      rooms[socket.roomId].playerId[shape] = '';
      socket.emit('shape deselection successful', {
        shapeId: shapeId
      });

      io.in(socket.roomId).emit('shape deselected', {
        shapeId: shapeId
      });

      // If there were two players, reset the grid
      if (rooms[socket.roomId].playerId[otherShape(shape)] !== '') {
        resetRoom();
        io.in(socket.roomId).emit('score update', {
          shapeId: shapeToId(otherShape(shape)),
          score: rooms[socket.roomId].playerScore[otherShape(shape)]
        });
      }
      return true;
    }
    return false;
  }

  function addPlayer(shapeId) {
    var shape = idToShape(shapeId);
    
    if (rooms[socket.roomId].playerId[shape] === '') {
      rooms[socket.roomId].playerId[shape] = socket.id;
      socket.emit('shape selection successful', {
        shapeId: shapeId
      });

      io.in(socket.roomId).emit('shape selected', {
        shapeId: shapeId
      });

      if (rooms[socket.roomId].playerId[otherShape(shape)] !== '') {
        initialiseRoom();
      }
    }
  }

  function initialiseRoom() {
    rooms[socket.roomId].grid = [];
    rooms[socket.roomId].gamestart = true;
    if (Math.random() < 0.5) {
      rooms[socket.roomId].turn = 'X';
      rooms[socket.roomId].startingPlayer = 'X';
    }
    else {
      rooms[socket.roomId].turn = 'O';
      rooms[socket.roomId].startingPlayer = 'O';
    }

    io.in(socket.roomId).emit('game start', {turn: rooms[socket.roomId].turn});
  }

  function resetRoom() {
    rooms[socket.roomId].grid = [];
    rooms[socket.roomId].gamestart = false;
    rooms[socket.roomId].playerScore.X = 0;
    rooms[socket.roomId].playerScore.O = 0;
    rooms[socket.roomId].turn = '';
    rooms[socket.roomId].startingPlayer = '';
    io.in(socket.roomId).emit('reset grid', {});
  }

  function isTurn(shape) {
    if (socket.id === rooms[socket.roomId].playerId[shape]) {
      return true;
    }
    return false;
  }

  function placeGrid(gridId) {
    if (rooms[socket.roomId].grid[gridId] === undefined) {
      rooms[socket.roomId].grid[gridId] = rooms[socket.roomId].turn;
      // if yes then place grid and shape
      socket.broadcast.to(socket.roomId).emit('place grid', {
        gridId: gridId,
        shape: rooms[socket.roomId].turn,
        playerTurn: false
      });

      socket.emit('place grid', {
        gridId: gridId,
        shape: rooms[socket.roomId].turn,
        playerTurn: true
      });

      return true;
    }
    return false;
  }

  function nextGame() {
    // transmit to all other players and reset
    rooms[socket.roomId].gamestart = false;

    setTimeout(function() {
      rooms[socket.roomId].grid = [];
      rooms[socket.roomId].startingPlayer = otherShape(rooms[socket.roomId].startingPlayer);
      rooms[socket.roomId].turn = rooms[socket.roomId].startingPlayer;

      io.in(socket.roomId).emit('reset grid', {});
      io.in(socket.roomId).emit('game turn', {
        turn: rooms[socket.roomId].turn
      });
      rooms[socket.roomId].gamestart = true;
    }, 1000);
  }
});

function otherShape(shape) {
  if (shape === 'O') {return 'X';}
  else if (shape === 'X') {return 'O';}
  else {return '';}
}

function idToShape(shapeId) {
  if (shapeId === 0) {return 'X';}
  else if (shapeId === 1) {return 'O';}
}

function shapeToId(shape) {
  if (shape === 'X') {return 0;}
  else if (shape === 'O') {return 1;}
}

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/:id', function(request, response){
  var roomId = request.params.id;
  if (roomId >= 1 && roomId <= 9) {
    response.render('pages/room');
  }
  else {
    response.render('pages/404');
  }
});