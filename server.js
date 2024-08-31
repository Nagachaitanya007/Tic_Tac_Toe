const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
let gameState = Array(9).fill('');
let currentPlayer = 'X';

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Body parser middleware
app.use(bodyParser.json());

// API endpoint to save game state
app.post('/api/saveGame', (req, res) => {
    gameState = req.body.gameState;
    currentPlayer = req.body.currentPlayer;
    res.sendStatus(200);
});

// API endpoint to load game state
app.get('/api/loadGame', (req, res) => {
    res.json({ gameState, currentPlayer });
});

// Listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
