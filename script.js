let ogBoard;
let huPlayer = 'O';
let aiPlayer = 'X';
let resultMessage = '';
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6]
];

function chooseWeapon(weapon) {
  huPlayer = weapon;
  aiPlayer = weapon === 'O' ? 'X' : 'O';
  ogBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', turnClick, false);
  }
  fadeOutElement(document.querySelector('.chooseWeapon'));
  fadeInElement(document.querySelector('.board'));
  fadeInElement(document.querySelector('.result'));
  document.querySelector('.chooseWeapon').style.display = "none";
}

function fadeOutElement(element) {
  element.classList.add('fade-out'); 
  setTimeout(function () {
    element.style.display = 'none'; 
  }, 300); 
}

function fadeInElement(element) {
  element.style.display = 'block'; 
  setTimeout(function () {
    element.classList.remove('fade-out');
  }, 0); 
}

function playSound() {
  let audio = new Audio('media/sound.wav');
  audio.play();
}
const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
  document.querySelector('.chooseWeapon').style.display = "block";
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
  }
  document.querySelector('.result').innerText = '';
}

function turn(squareId, player) {
  ogBoard[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  let gameWon = checkWin(ogBoard, player);
  if (gameWon) gameOver(gameWon);
  checkTie();
}

function turnClick(square) {
  if (typeof ogBoard[square.target.id] === 'number') {
    turn(square.target.id, huPlayer);
    if (!checkWin(ogBoard, huPlayer) && !checkTie())
      turn(bestSpot(), aiPlayer);
  }
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    const cell = document.getElementById(index);
    cell.style.color = gameWon.player === huPlayer ? "green" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }

  if (gameWon.player === huPlayer) {
    resultMessage = '<b style="color: green;">You Win!</b>';
  } else if (gameWon.player === aiPlayer) {
    resultMessage = '<b style="color: red;">You Lose!</b>';
  }
  document.querySelector('.result').innerHTML = resultMessage;

}

function emptySquares() {
  return ogBoard.filter((elem, i) => i === elem);
}

function bestSpot() {
  return minimax(ogBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length === 0) {
    for (let cell of cells) {
      cell.style.color = "orange";
      cell.removeEventListener('click', turnClick, false);
    }
    document.querySelector('.result').innerHTML = '<b style="color: orange;">Tie Game!</b>';

    return true;
  }
  return false;
}

let aiTurn = false;

function turnClick(square) {
  if (aiTurn || typeof ogBoard[square.target.id] !== 'number') {
    return;
  }

  turn(square.target.id, huPlayer);
  if (!checkWin(ogBoard, huPlayer) && !checkTie()) {
    aiTurn = true;
    setTimeout(function () {
      turn(bestSpot(), aiPlayer);
      playSound();
      aiTurn = false;
    }, 500);
  }
}

function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  var moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      move.score = minimax(newBoard, huPlayer).score + Math.random() * 2;
    } else {
      move.score = minimax(newBoard, aiPlayer).score - Math.random() * 2;
    }

    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }

  var bestMove, bestScore;
  if (player === aiPlayer) {
    bestScore = -1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    bestScore = 1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}



