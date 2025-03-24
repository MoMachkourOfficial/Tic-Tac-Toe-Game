import confetti from 'canvas-confetti';

class TicTacToe {
  constructor() {
    this.currentPlayer = 'X';
    this.board = ['', '', '', '', '', '', '', '', ''];
    this.gameActive = true;
    
    this.cellElements = document.querySelectorAll('.cell');
    this.statusDisplay = document.getElementById('status');
    this.resetButton = document.getElementById('reset-btn');
    
    this.initializeEventListeners();
  }
  
  initializeEventListeners() {
    this.cellElements.forEach((cell, index) => {
      cell.addEventListener('click', () => this.cellClicked(cell, index));
    });
    
    this.resetButton.addEventListener('click', () => this.resetGame());
  }
  
  cellClicked(clickedCell, cellIndex) {
    if (this.board[cellIndex] !== '' || !this.gameActive) return;
    
    this.board[cellIndex] = this.currentPlayer;
    clickedCell.textContent = this.currentPlayer;
    clickedCell.setAttribute('data-player', this.currentPlayer);
    
    if (this.checkWin()) {
      this.endGame(false);
      return;
    }
    
    if (this.checkDraw()) {
      this.endGame(true);
      return;
    }
    
    this.switchPlayer();
  }
  
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    this.statusDisplay.textContent = `${this.currentPlayer}'s Turn`;
  }
  
  checkWin() {
    const winConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
      [0, 4, 8], [2, 4, 6]  // Diagonals
    ];
    
    return winConditions.some(condition => {
      return condition.every(index => {
        return this.board[index] === this.currentPlayer;
      });
    });
  }
  
  checkDraw() {
    return this.board.every(cell => cell !== '');
  }
  
  endGame(draw) {
    this.gameActive = false;
    if (draw) {
      this.statusDisplay.textContent = 'Draw!';
    } else {
      this.statusDisplay.textContent = `Player ${this.currentPlayer} Wins!`;
      this.celebrateWin();
    }
  }
  
  celebrateWin() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
      startVelocity: 30, 
      spread: 360, 
      ticks: 60, 
      zIndex: 0 
    };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Main confetti burst
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1']
      }));
      
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#6a11cb', '#2575fc', '#ff4757']
      }));
    }, 250);
  }
  
  resetGame() {
    this.currentPlayer = 'X';
    this.board = ['', '', '', '', '', '', '', '', ''];
    this.gameActive = true;
    this.statusDisplay.textContent = `${this.currentPlayer}'s Turn`;
    
    this.cellElements.forEach(cell => {
      cell.textContent = '';
      cell.removeAttribute('data-player');
    });
  }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
  new TicTacToe();
});
