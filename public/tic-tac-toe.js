var squares = document.getElementsByClassName('square');
var message = document.getElementById('message');
var button = document.getElementById('button');

var player1 = 'X';
var player2 = 'O';
var currentPlayer = player1;
var winner;
var game_on = false;

var player1Score = 0;
var player2Score = 0;

var board = [['E', 'E', 'E'],
            ['E', 'E', 'E'],
            ['E', 'E', 'E']];

var numberOfMoves = 0;
var movesForDraw = board.length * board.length;


function updateGame(targetId) {
  // will only run if square is empty
  if (game_on && recordMove(targetId)) {
    changeDOM(targetId);
    // checks if current player has won
    if (checkWin()) {
      declareWinner();
      resetGrid();
      // winner starts first in next game
      changePlayer();
    }
      // checks for draw condition
    else if (numberOfMoves !== movesForDraw) {
      // changes player for each turn
      changePlayer();
      return false;
    } else {
      message.textContent = 'It\'s a draw!';
      resetGrid();
    }
  }
}

function recordMove(targetId) {

  // rethink logic - the strings/IDs are arbitrary values in this context
  switch (targetId) {
    case 'S1':
      if (board[0][0] === 'E'){
        board[0][0] = currentPlayer;
        numberOfMoves++;
        return true;
      }
      break;
    case 'S2':
      if (board[0][1] === 'E'){
        board[0][1] = currentPlayer;
        numberOfMoves++;
        return true;
      }
      break;
    case 'S3':
      if (board[0][2] === 'E'){
        board[0][2] = currentPlayer;
        numberOfMoves++;
        return true;
      }
      break;
    case 'S4':
      if (board[1][0] === 'E'){
        board[1][0] = currentPlayer;
        numberOfMoves++;
        return true;
      }
      break;
    case 'S5':
      if (board[1][1] === 'E'){
        board[1][1] = currentPlayer;
        numberOfMoves++;
        return true;
      }
      break;
    case 'S6':
      if (board[1][2] === 'E'){
        board[1][2] = currentPlayer;
        numberOfMoves++;
        return true;
      }
      break;
    case 'S7':
      if (board[2][0] === 'E'){
        board[2][0] = currentPlayer;
        numberOfMoves++;
        return true;
      }
      break;
    case 'S8':
      if (board[2][1] === 'E'){
        board[2][1] = currentPlayer;
        numberOfMoves++;
        return true;
      }
      break;
    case 'S9':
      if (board[2][2] === 'E'){
        board[2][2] = currentPlayer;
        numberOfMoves++;
        return true;
      }
      break;
    default:
      return false;
  }
}

function changeDOM(targetId) {
  target = document.getElementById(targetId);
  if (currentPlayer === player1) {
    target.textContent = 'X';
    target.style.color = 'pink';
    message.textContent = player2 + '\'s turn';
  }
  if (currentPlayer === player2) {
    target.textContent = 'O';
    // target.style.color = '#1f2593';
    target.style.backgroundColor = 'transparent';
    textContent = player1 + '\'s turn';
  }
}

function changePlayer() {
  if (currentPlayer === player1) {
    currentPlayer = player2;
  } else {
    currentPlayer = player1;
  }
}

function checkWin() {
  // to determine if a win condition has occured - yikes!
      // row wins
  if (( (board[0][0] === board[0][1]) && (board[0][1] === board[0][2]) && (board[0][2] === currentPlayer) ) ||
      ( (board[1][0] === board[1][1]) && (board[1][1] === board[1][2]) && (board[1][2] === currentPlayer) ) ||
      ( (board[2][0] === board[2][1]) && (board[2][1] === board[2][2]) && (board[2][2] === currentPlayer) ) ||
      // column wins
      ( (board[0][0] === board[1][0]) && (board[1][0] === board[2][0]) && (board[2][0] === currentPlayer) ) ||
      ( (board[0][1] === board[1][1]) && (board[1][1] === board[2][1]) && (board[2][1] === currentPlayer) ) ||
      ( (board[0][2] === board[1][2]) && (board[1][2] === board[2][2]) && (board[2][2] === currentPlayer) ) ||
      // diagonal wins
      ( (board[0][0] === board[1][1]) && (board[1][1] === board[2][2]) && (board[2][2] === currentPlayer) ) ||
      ( (board[0][2] === board[1][1]) && (board[1][1] === board[2][0]) && (board[2][0] === currentPlayer) )) {
      winner = currentPlayer;
      return true;
  } else {
      return false;
  }
}

function declareWinner() {
  if (winner === 'X') {
    player1Score += 1;
    message.textContent = currentPlayer + ' wins!';
    document.getElementById('score-P1').textContent = player1Score;
  } else {
    player2Score += 1;
    message.textContent = currentPlayer + ' wins!';
    document.getElementById('score-P2').textContent = player2Score;
  }
  game_on = false;
}

function resetGrid() {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      board[i][j] = 'E';
    }
  }
}

function clearSquares() {
  for (var i = 0; i < squares.length; i++) {
    squares[i].textContent = '';
    squares[i].backgroundColor = '';
  }
}

function makeEventListeners() {
  for (var i = 0; i < squares.length; i++) {
    squares[i].addEventListener('click', emit);
  }
}



function restartGame() {
  makeEventListeners();
  resetGrid();
  // clears all squares and displays message
  setTimeout(function() {
    numberOfMoves = 0;
    message.textContent = currentPlayer + ' starts';
    clearSquares();
    game_on = true;
  }, 1000);
  button.textContent = 'Reset';
}

