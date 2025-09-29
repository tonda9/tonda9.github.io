let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameMode = 0; // 1 = bot, 2 = dva hráči
let gameOver = false;

function startGame(mode) {
    gameMode = mode;
    document.getElementById("game-mode").style.display = "none";
    document.getElementById("game-board").style.display = "block";
    resetGame();
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;
    updateBoard();
    document.getElementById("status").textContent = gameMode === 1 ? "Hraješ proti botovi. Začíná hráč X." : "Začíná hráč X.";
}

function updateBoard() {
    const cells = document.querySelectorAll(".cell");
    for (let i = 0; i < 9; i++) {
        cells[i].textContent = board[i];
        cells[i].disabled = board[i] !== "" || gameOver;
    }
}

function makeMove(index) {
    if (gameOver || board[index] !== "") return;
    board[index] = currentPlayer;
    updateBoard();

    if (checkWin(currentPlayer)) {
        document.getElementById("status").textContent = `Vyhrál hráč ${currentPlayer}!`;
        gameOver = true;
        return;
    }
    if (board.every(cell => cell !== "")) {
        document.getElementById("status").textContent = "Remíza!";
        gameOver = true;
        return;
    }

    if (gameMode === 1) {
        if (currentPlayer === "X") {
            currentPlayer = "O";
            document.getElementById("status").textContent = "Hraje bot (O)...";
            setTimeout(botMove, 600);
        } else {
            currentPlayer = "X";
            document.getElementById("status").textContent = "Tvůj tah (X).";
        }
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        document.getElementById("status").textContent = `Hraje hráč ${currentPlayer}.`;
    }
}

function checkWin(player) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8], // řádky
        [0,3,6],[1,4,7],[2,5,8], // sloupce
        [0,4,8],[2,4,6]          // úhlopříčky
    ];
    return wins.some(combo =>
        combo.every(i => board[i] === player)
    );
}

function botMove() {
    // Bot: nejprve obrana/útok, jinak random
    let move = findBestMove("O") || findBestMove("X");
    if (move === null) {
        const empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
        move = empty[Math.floor(Math.random() * empty.length)];
    }
    board[move] = "O";
    updateBoard();

    if (checkWin("O")) {
        document.getElementById("status").textContent = "Prohrál jsi! Vyhrál bot (O).";
        gameOver = true;
        return;
    }
    if (board.every(cell => cell !== "")) {
        document.getElementById("status").textContent = "Remíza!";
        gameOver = true;
        return;
    }
    currentPlayer = "X";
    document.getElementById("status").textContent = "Tvůj tah (X).";
}

// Vrací index na obranu nebo útok (winning move / blocking move)
function findBestMove(player) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (const combo of wins) {
        const [a, b, c] = combo;
        const values = [board[a], board[b], board[c]];
        if (values.filter(v => v === player).length === 2 && values.includes("")) {
            return combo[values.indexOf("")];
        }
    }
    return null;
}