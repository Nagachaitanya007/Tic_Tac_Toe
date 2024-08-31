// Select elements from the DOM
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const gameStatus = document.getElementById('gameStatus'); // Game status element

// Initialize the game state
let currentPlayer = 'X'; // Keeps track of the current player (X or O)
let gameState = Array(9).fill(''); // Array to keep track of the game board state

// Add event listeners to each cell for player moves
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');

        // If the cell is empty, make a move
        if (!gameState[index]) {
            gameState[index] = currentPlayer; // Update game state
            cell.textContent = currentPlayer; // Display the player's move
            checkWinner(); // Check if the game has been won
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
            saveGameState(); // Save the game state to the server (AJAX + JSON)
        }
    });
});

// Add event listener to the reset button to reset the game
resetButton.addEventListener('click', resetGame);

// Function to check if there is a winner or a draw
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            showGameStatus(`Player ${gameState[a]} wins!`);
            resetGame(false); // Reset the game after displaying the win message
            return;
        }
    }

    // If all cells are filled and no winner, it's a draw
    if (!gameState.includes('')) {
        showGameStatus("It's a draw!");
        resetGame(false); // Reset the game after displaying the draw message
    }
}

// Function to display the game status message
function showGameStatus(message) {
    gameStatus.textContent = message;
    gameStatus.classList.remove('hidden');
}

// Function to reset the game state
function resetGame(hideStatus = true) {
    gameState.fill(''); // Clear the game state
    cells.forEach(cell => cell.textContent = ''); // Clear the board
    currentPlayer = 'X'; // Reset the starting player
    saveGameState(); // Save the reset state to the server (AJAX + JSON)
    if (hideStatus) {
        gameStatus.classList.add('hidden'); // Hide the game status message
    }
}

// Function to save the game state using AJAX
function saveGameState() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/saveGame', true); // API endpoint to save game state
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('Game state saved successfully');
        }
    };
    // Send game state and current player as JSON
    xhr.send(JSON.stringify({ gameState, currentPlayer }));
}

// Function to load the game state from the server using AJAX
function loadGameState() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/loadGame', true); // API endpoint to load game state
    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText); // Parse JSON response
            gameState = data.gameState; // Update game state
            currentPlayer = data.currentPlayer; // Update current player
            updateBoard(); // Update the board with the loaded state
        }
    };
    xhr.send(); // Send the request to load the game state
}

// Function to update the board with the loaded game state
function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = gameState[index]; // Display the loaded game state
    });
}

// Load the game state when the page is loaded
window.onload = loadGameState;
