// ============================================
// TIC-TAC-TOE WITH HARD AI (MINIMAX)
// ============================================

// Game State
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = '2p'; // '2p' or 'ai'
let aiPlayer = 'O';
let humanPlayer = 'X';

// Scores
let scores = {
    x: 0,
    o: 0,
    draw: 0
};

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// DOM Elements
const cells = document.querySelectorAll('.cell');
const turnIndicator = document.getElementById('turn-indicator');
const resultDiv = document.getElementById('result');
const aiThinking = document.getElementById('ai-thinking');

// ============================================
// SET GAME MODE
// ============================================
function setMode(mode) {
    gameMode = mode;
    
    // Update buttons
    document.getElementById('mode-2p').classList.toggle('active', mode === '2p');
    document.getElementById('mode-ai').classList.toggle('active', mode === 'ai');
    
    resetAll();
}

// ============================================
// MAKE MOVE
// ============================================
function makeMove(index) {
    if (!gameActive || board[index] !== '') return;
    
    // Human move
    board[index] = currentPlayer;
    updateCell(index, currentPlayer);
    
    // Check win
    if (checkWin(currentPlayer)) {
        endGame(currentPlayer + ' Wins! 🎉', 'win');
        highlightWin(currentPlayer);
        updateScore(currentPlayer);
        return;
    }
    
    // Check draw
    if (checkDraw()) {
        endGame("It's a Draw! 🤝", 'draw');
        updateScore('draw');
        return;
    }
    
    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator();
    
    // AI Move
    if (gameMode === 'ai' && currentPlayer === aiPlayer && gameActive) {
        setTimeout(() => {
            aiMove();
        }, 500);
    }
}

// ============================================
// AI MOVE (MINIMAX ALGORITHM)
// ============================================
function aiMove() {
    if (!gameActive) return;
    
    aiThinking.classList.add('show');
    
    setTimeout(() => {
        const bestMove = getBestMove();
        board[bestMove] = aiPlayer;
        updateCell(bestMove, aiPlayer);
        
        aiThinking.classList.remove('show');
        
        // Check win
        if (checkWin(aiPlayer)) {
            endGame('AI Wins! 🤖', 'lose');
            highlightWin(aiPlayer);
            updateScore(aiPlayer);
            return;
        }
        
        // Check draw
        if (checkDraw()) {
            endGame("It's a Draw! 🤝", 'draw');
            updateScore('draw');
            return;
        }
        
        currentPlayer = humanPlayer;
        updateTurnIndicator();
    }, 600);
}

// ============================================
// MINIMAX ALGORITHM
// ============================================
function getBestMove() {
    let bestScore = -Infinity;
    let move = -1;
    
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = aiPlayer;
            let score = minimax(board, 0, false);
            board[i] = '';
            
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    
    return move;
}

function minimax(board, depth, isMaximizing) {
    // Terminal states
    if (checkWin(aiPlayer)) return 10 - depth;
    if (checkWin(humanPlayer)) return depth - 10;
    if (checkDraw()) return 0;
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = aiPlayer;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = humanPlayer;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// ============================================
// CHECK WIN
// ============================================
function checkWin(player) {
    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === player);
    });
}

// ============================================
// CHECK DRAW
// ============================================
function checkDraw() {
    return board.every(cell => cell !== '');
}

// ============================================
// HIGHLIGHT WINNING CELLS
// ============================================
function highlightWin(player) {
    winPatterns.forEach(pattern => {
        if (pattern.every(index => board[index] === player)) {
            pattern.forEach(index => {
                cells[index].classList.add('winner');
            });
        }
    });
}

// ============================================
// UPDATE CELL
// ============================================
function updateCell(index, player) {
    cells[index].textContent = player;
    cells[index].classList.add(player.toLowerCase());
}

// ============================================
// UPDATE TURN INDICATOR
// ============================================
function updateTurnIndicator() {
    if (gameMode === 'ai' && currentPlayer === aiPlayer) {
        turnIndicator.textContent = '🤖 AI is thinking...';
    } else {
        turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

// ============================================
// END GAME
// ============================================
function endGame(message, type) {
    gameActive = false;
    resultDiv.textContent = message;
    resultDiv.className = 'result ' + type;
}

// ============================================
// UPDATE SCORE
// ============================================
function updateScore(winner) {
    if (winner === 'X') scores.x++;
    else if (winner === 'O') scores.o++;
    else scores.draw++;
    
    document.getElementById('score-x').textContent = scores.x;
    document.getElementById('score-o').textContent = scores.o;
    document.getElementById('score-draw').textContent = scores.draw;
}

// ============================================
// RESET GAME
// ============================================
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
    });
    
    resultDiv.textContent = '';
    resultDiv.className = 'result';
    aiThinking.classList.remove('show');
    
    updateTurnIndicator();
}

// ============================================
// RESET ALL
// ============================================
function resetAll() {
    scores = { x: 0, o: 0, draw: 0 };
    document.getElementById('score-x').textContent = '0';
    document.getElementById('score-o').textContent = '0';
    document.getElementById('score-draw').textContent = '0';
    resetGame();
}

// Initialize
updateTurnIndicator();

