$('.message, .scoreboard').fadeIn(1000);

var socket = io();
socket.roomId =  location.pathname.replace(/[\/]/g, "");

// click functions
$('#exit').click(function() {
  $('.message, .scoreboard').fadeOut(300);
  $('.grid').fadeOut(1000);
  setTimeout(function() {
    window.location = "/";
  }, 1000);
});

$('.scoreboard > div').click(function() {
  var shapeId = $('.scoreboard > div').index($(event.target).closest('div'));
  socket.emit('shape select', {shapeId: shapeId});
});

$('.grid').click(function() {
  var gridId = $('.square').index($(event.target).closest('.square'));
  socket.emit('grid select', {gridId: gridId});
});

// socket functions
socket.on('roomId request', function(data) {
  socket.emit('add user', {roomId: socket.roomId});
});

socket.on('room data', function(room) {
  if (room.playerId.X !== '') {
    $('.scoreboard p:eq(0)').text('Score: ' + room.playerScore.X).removeClass('shape-select');
  }
  if (room.playerId.O !== '') {
    $('.scoreboard p:eq(1)').text('Score: ' + room.playerScore.O).removeClass('shape-select');
  }
  if (room.gamestart) {
    for (var i = 0; i < 9; i++) {
      if (room.grid[i] === 'O' || room.grid[i] === 'X') {
        $('.grid span:eq(' + i + ')').text(room.grid[i]);
      }
    }
    $('#message p').text("Player " + room.turn + "'s turn");
  }
});

socket.on('shape selection successful', function(data) {
  $('.scoreboard h2:eq(' + data.shapeId + ')').addClass('shape-assigned');
});

socket.on('shape selected', function(data) {
  $('.scoreboard p:eq(' + data.shapeId + ')').text('Score: 0').removeClass('shape-select');
  if (data.shapeId === 0) {
    $('#message p').text("Player X joined");
  }
  else if (data.shapeId === 1) {
    $('#message p').text("Player O joined");
  }
});

socket.on('shape deselection successful', function(data) {
  $('.scoreboard h2:eq(' + data.shapeId + ')').removeClass('shape-assigned');
});

socket.on('shape deselected', function(data) {
  $('.scoreboard p:eq(' + data.shapeId + ')').text('Select').addClass('shape-select');
  if (data.shapeId === 0) {
    $('#message p').text("Player X left..");
  }
  else if (data.shapeId === 1) {
    $('#message p').text("Player O left..");
  }
});

socket.on('game start', function(data) {
  $('#message p').text("Player " + data.turn + " starts");
});

socket.on('game turn', function(data) {
  $('#message p').text("Player " + data.turn + "'s turn");
});

socket.on('player win', function(data) {
  $('#message p').text("Player " + data.shape + " wins!");
});

socket.on('player draw', function(data) {
  $('#message p').text("It's a draw!");
});

socket.on('place grid', function(data) {
  $('.square span:eq(' + data.gridId + ')').text(data.shape);
  if (data.playerTurn) {
    $('.square span:eq(' + data.gridId + ')').addClass('player-color');
  }
});

socket.on('reset grid', function(data) {
  $('.grid span').text("").removeClass('player-color');
});

socket.on('score update', function(data) {
  $('.scoreboard p:eq(' + data.shapeId + ')').text('Score: ' + data.score);
});