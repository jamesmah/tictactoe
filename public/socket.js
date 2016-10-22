var socket = io();

// clickOnRoomTransmit(2);
// clickOnPlayerShapeTransmit('X');


function retrieveServerInfo() {
  socket.emit('retrieveServerInfo', '');
}

socket.on('retrieveServerInfo', function(data) {
  console.log(data[0]);
  console.log(data[0][5]);
  console.log(data[1]);
  console.log(data[2]);
  console.log(data[3]);
  console.log(data[4]);
});




function clickOnRoomTransmit(roomId) {
  // send click data to server
  socket.emit('clickOnRoom', roomId);
}

function clickOnPlayerShapeTransmit(shape) {
  socket.emit('clickOnPlayerShape', shape);
}

function submitUsernameTransmit(username) {
  socket.emit('usernameInput', username);
}

function clickOnAGridTransmit(gridId) {
  socket.emit('clickOnAGrid', gridId);
}

function exitRoomTransmit() {
  socket.emit('exitRoom', '');
}


socket.on('goIntoRoom', function(roomData){
  goIntoRoom(roomData);
});

function goIntoRoom(roomData){
  //with room data, set up room with animation
}

socket.on('activateShapePromptUsernameInput', function(shape) {
  // activate shape and prompt username input
  activateShape(shape);
  $('#usernameInput').show();
  // if username not inputted before
});

function activateShape(shape) {

}

socket.on('placeGrid', function(gridData) {
  var gridId = gridData[0];
  var playerShape = gridData[1];
  // place gridshape on Id
  $('.grid > div > div:eq(' + gridId + ')').text(playerShape);
  if (playerShape === 'X') {
    $('.grid > div > div:eq(' + gridId + ')').addClass('squareX');
  }
  else {
    $('.grid > div > div:eq(' + gridId + ')').addClass('squareY');
    // $('.grid > div > div:hover:eq(' + gridId + ')').css('color','#fff');
  }
});

socket.on('player win', function(shape) {
  // show victory
  // reset board
  console.log(shape + 'wins');
  $('#message').text(shape + ' wins!');
});

socket.on('score update', function(scores) {
  // update scores with array
  $('#score-P1').text(scores.X);
  $('#score-P2').text(scores.O);
});



$('.grid').click(function() {
  if ($('.grid').hasClass('roomSelection') ) {
    var roomId = $('.roomSelection > div > div').index($(event.target).closest('div')) + 1;
    console.log(roomId);
    if (roomId >= 1 && roomId <= 9) {
      clickOnRoomTransmit(roomId);
      // $('.roomSelection').hide();
      // $('#gameDisplay').show();
      $('#quitGame').show();
      resetGrid();
      $('.grid').toggleClass("roomSelection gameGrid");
      $('#message').text("Choose a side");
    }
  }
  else if ($('.grid').hasClass('gameGrid') ) {
    var gridId = $('.gameGrid > > div').index($(event.target).closest('div'));
    console.log(gridId);
    clickOnAGridTransmit(gridId);
  }
});

$('#shapeSelection').click(function() {
  var shapeId = $('#shapeSelection > div').index($(event.target).closest('div'));
  if (shapeId === 0) {
    console.log('X');
    clickOnPlayerShapeTransmit('X');
  }
  else if (shapeId === 1) {
    console.log('O');
    clickOnPlayerShapeTransmit('O');
  }
});

// $('.gameGrid').click(function() {
//   var gridId = $('.gameGrid > > div').index($(event.target).closest('div'));
//   console.log(gridId);
//   clickOnAGridTransmit(gridId);
// });


// $('button').click(function() {
//   submitUsernameTransmit( $('input').val() );
//   $('#usernameInput').hide();
// });


$('#quitGame').click(function() {
  exitRoomTransmit();
  // $('.roomSelection').show();
  // $('#gameDisplay').hide();
  // $('#usernameInput').hide();

  resetGrid();
  
  var tictactoe = ['T','I','C','T','A','C','T','O','E'];
  for (var i = 0; i < tictactoe.length; i++) {
    $('.grid > div > div:eq(' + i + ')').text(tictactoe[i]).css('color', '#1f2593');
  }

  $('#quitGame').hide();
  $('.grid').toggleClass("roomSelection gameGrid").removeClass('squareX squareY');
  $('#message').text('●_●');

});

socket.on('displayTurn', function(turn) {
  if (turn !== '') {
    $('#message').text(turn + "'s turn");
  }
  else {
    $('#message').text("");
  }
});

socket.on('resetRoom', function(empty) {
  if ( $('.grid').hasClass('gameGrid') ) {
    $('.grid > div > div').text('').removeClass('squareX squareY');
  }
});


function resetGrid() {
  $('.grid > div > div').text('').removeClass('squareX squareY');
}

$('.scores h2').click(function() {
  event.target.style.color = 'pink';
});


