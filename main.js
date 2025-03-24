import confetti from 'canvas-confetti';

class OasisGame {
  constructor() {
    this.currentPlayer = 'X';
    this.board = ['', '', '', '', '', '', '', '', ''];
    this.gameActive = true;
    
    this.cellElements = document.querySelectorAll('.cell');
    this.statusDisplay = document.getElementById('status');
    this.resetButton = document.getElementById('reset-btn');
    
    // Initialize Web Audio Context
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Call the method to initialize event listeners
    this.initializeEventListeners();
  }
  
  // Add the missing initializeEventListeners method
  initializeEventListeners() {
    // Add click event listeners to each cell
    this.cellElements.forEach((cell) => {
      cell.addEventListener('click', (event) => this.handleCellClick(event));
    });
    
    // Add click event listener to reset button
    this.resetButton.addEventListener('click', () => this.resetGame());
  }
  
  // Handle cell click logic
  handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
    
    // Check if the cell is already played or game is not active
    if (this.board[clickedCellIndex] !== '' || !this.gameActive) {
      return;
    }
    
    // Update the cell and board
    this.board[clickedCellIndex] = this.currentPlayer;
    clickedCell.textContent = this.currentPlayer;
    clickedCell.setAttribute('data-player', this.currentPlayer);
    
    // Check for win or draw
    if (this.checkWin()) {
      this.statusDisplay.textContent = `Player ${this.currentPlayer} Wins!`;
      this.gameActive = false;
      this.celebrateWin();
      return;
    }
    
    if (this.checkDraw()) {
      this.statusDisplay.textContent = "It's a Draw!";
      this.gameActive = false;
      return;
    }
    
    // Switch players
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    this.statusDisplay.textContent = `${this.currentPlayer}'s Turn`;
  }
  
  // Check for a win condition
  checkWin() {
    const winConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    
    return winConditions.some(condition => {
      const [a, b, c] = condition;
      return this.board[a] && 
             this.board[a] === this.board[b] && 
             this.board[a] === this.board[c];
    });
  }
  
  // Check for a draw condition
  checkDraw() {
    return this.board.every(cell => cell !== '');
  }
  
  // Method to generate a celebratory sound
  playWinSound() {
    // Create an oscillator (sound generator)
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    // Set up a cheerful, ascending tone
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // Start at A4
    
    // Create a quick ascending pitch effect
    oscillator.frequency.exponentialRampToValueAtTime(
      880, // Go up an octave
      this.audioContext.currentTime + 0.5 // Over half a second
    );
    
    // Configure volume
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001, 
      this.audioContext.currentTime + 0.5
    );
    
    // Connect and play the sound
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }
  
  celebrateWin() {
    // Play generated sound
    this.playWinSound();

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
    // Modify reset to handle audio context
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
  new OasisGame();
});
