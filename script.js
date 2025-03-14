let playerName = '';
let currentPlayer = 'player';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let difficulty = 'easy';

const cells = document.querySelectorAll('.cell');
const startGameBtn = document.getElementById('start-game');
const playerNameInput = document.getElementById('player-name');
const gameScreen = document.getElementById('game-screen');
const loginScreen = document.getElementById('login-screen');
const turnMessage = document.getElementById('turn-message');
const resetGameBtn = document.getElementById('reset-game');
const difficultySelect = document.getElementById('difficulty');

startGameBtn.addEventListener('click', startGame);
resetGameBtn.addEventListener('click', resetGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

function startGame() {
  playerName = playerNameInput.value.trim();
  difficulty = difficultySelect.value;
  if (playerName) {
    loginScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    updateTurnMessage();
  } else {
    alert('Por favor, digite seu nome');
  }
}

function handleCellClick(event) {
  if (gameOver) return;

  const index = event.target.id.replace('cell', '') - 1;
  if (gameBoard[index] !== '') return;

  gameBoard[index] = currentPlayer;
  event.target.textContent = currentPlayer === 'player' ? 'X' : 'O';
  checkWinner();
  switchPlayer();
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'player' ? 'machine' : 'player';
  updateTurnMessage();
  if (currentPlayer === 'machine' && !gameOver) {
    setTimeout(machineTurn, 1000);
  }
}

function updateTurnMessage() {
  if (currentPlayer === 'player') {
    turnMessage.textContent = `${playerName}, sua vez!`;
  } else {
    turnMessage.textContent = `Agora é a vez do Capitão Z jogar!`;
  }
}

function machineTurn() {
  if (gameOver) return;

  let move;
  if (difficulty === 'easy') {
    move = easyMove();
  } else if (difficulty === 'medium') {
    move = mediumMove();
  } else if (difficulty === 'hard') {
    move = hardMove();
  }

  gameBoard[move] = 'machine';
  cells[move].textContent = 'O';
  checkWinner();
  switchPlayer();
}

function easyMove() {
  const availableMoves = gameBoard
    .map((value, index) => (value === '' ? index : null))
    .filter(index => index !== null);
  
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function mediumMove() {
  const availableMoves = gameBoard
    .map((value, index) => (value === '' ? index : null))
    .filter(index => index !== null);

  // Verifica se a máquina pode ganhar ou se deve bloquear o jogador
  for (let i = 0; i < availableMoves.length; i++) {
    const move = availableMoves[i];
    const tempBoard = [...gameBoard];
    tempBoard[move] = 'machine';
    if (checkWin(tempBoard, 'machine')) {
      return move;
    }
  }

  // Bloqueia o jogador
  for (let i = 0; i < availableMoves.length; i++) {
    const move = availableMoves[i];
    const tempBoard = [...gameBoard];
    tempBoard[move] = 'player';
    if (checkWin(tempBoard, 'player')) {
      return move;
    }
  }

  return easyMove(); // Se não houver vitória ou bloqueio, joga aleatoriamente
}

function hardMove() {
  const availableMoves = gameBoard
    .map((value, index) => (value === '' ? index : null))
    .filter(index => index !== null);

  for (let i = 0; i < availableMoves.length; i++) {
    const move = availableMoves[i];
    const tempBoard = [...gameBoard];
    tempBoard[move] = 'machine';
    if (checkWin(tempBoard, 'machine')) {
      return move;
    }
  }

  for (let i = 0; i < availableMoves.length; i++) {
    const move = availableMoves[i];
    const tempBoard = [...gameBoard];
    tempBoard[move] = 'player';
    if (checkWin(tempBoard, 'player')) {
      return move;
    }
  }

  return easyMove(); // Se não houver vitória ou bloqueio, joga aleatoriamente
}

function checkWin(board, player) {
  const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const [a, b, c] of winningCombination) {
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }
  return false;
}

function checkWinner() {
  const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const [a, b, c] of winningCombination) {
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      gameOver = true;
      setTimeout(() => {
        alert(gameBoard[a] === 'player' ? `${playerName} ganhou!` : 'A Máquina ganhou!');
      }, 100);
      return;
    }
  }

  if (gameBoard.every(cell => cell !== '')) {
    gameOver = true;
    setTimeout(() => alert('Empate!'), 100);
  }
}

function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameOver = false;
  cells.forEach(cell => cell.textContent = '');
  startGame();
}
