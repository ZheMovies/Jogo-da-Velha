let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'player';
let gameOver = false;
let playerName = '';
let timer;
let remainingTime = 3;  // Tempo de 3 segundos para o nível Lendário

const cells = document.querySelectorAll('.cell');
const turnMessage = document.getElementById('turnMessage');
const resetGameBtn = document.getElementById('resetGameBtn');
const difficultySelect = document.getElementById('difficultySelect');

function startGame() {
  playerName = prompt('Qual é o seu nome?', 'Jogador');
  turnMessage.textContent = `${playerName}, sua vez!`;
}

function makeMove(index) {
  if (gameBoard[index] || gameOver) return;
  
  gameBoard[index] = currentPlayer;
  cells[index].textContent = currentPlayer === 'player' ? 'X' : 'O';
  
  checkWinner();
  
  if (!gameOver) {
    currentPlayer = currentPlayer === 'player' ? 'machine' : 'player';
    updateTurnMessage();
    
    if (currentPlayer === 'machine' && !gameOver) {
      machineMove();
    }
  }
}

function updateTurnMessage() {
  if (currentPlayer === 'player') {
    turnMessage.textContent = `${playerName}, sua vez!`;
  } else {
    turnMessage.textContent = `Agora é a vez da Máquina!`;
  }
}

function machineMove() {
  if (difficultySelect.value === 'legendary') {
    startLegendaryTimer();
  } else {
    setTimeout(() => {
      const move = getBestMove();
      makeMove(move);
    }, 1000); // Máquina espera 1 segundo antes de jogar
  }
}

function startLegendaryTimer() {
  remainingTime = 3;
  turnMessage.textContent = `Máquina jogando... Tempo restante: ${remainingTime}s`;
  timer = setInterval(() => {
    remainingTime--;
    turnMessage.textContent = `Máquina jogando... Tempo restante: ${remainingTime}s`;
    if (remainingTime <= 0) {
      clearInterval(timer);
      const move = getBestMove();
      makeMove(move);
    }
  }, 1000);
}

function getBestMove() {
  const availableMoves = gameBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

  // Estratégia da máquina (Média a difícil)
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

  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontais
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticais
    [0, 4, 8], [2, 4, 6]             // Diagonais
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      gameOver = true;
      turnMessage.textContent = gameBoard[a] === 'player' ? `${playerName} ganhou!` : 'A máquina ganhou!';
      resetGameBtn.style.display = 'block';
      return;
    }
  }

  if (!gameBoard.includes('')) {
    gameOver = true;
    turnMessage.textContent = 'Empate!';
    resetGameBtn.style.display = 'block';
  }
}

function checkWin(board, player) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return board[a] === player && board[b] === player && board[c] === player;
  });
}

function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameOver = false;
  currentPlayer = 'player';
  cells.forEach(cell => cell.textContent = '');
  turnMessage.textContent = `${playerName}, sua vez!`;
  resetGameBtn.style.display = 'none';
  updateTurnMessage();
}

// Evento para quando o jogador clicar em uma célula
cells.forEach((cell, index) => {
  cell.addEventListener('click', () => makeMove(index));
});

resetGameBtn.addEventListener('click', resetGame);

// Iniciar o jogo com o nome do jogador
startGame();