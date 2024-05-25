document.addEventListener('DOMContentLoaded', (event) => {
    createChessboard();
});

function createChessboard() {
    const boardSize = parseInt(document.getElementById('boardSize').value);
    const chessboard = document.getElementById('chessboard');

    chessboard.innerHTML = '';

    chessboard.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`;
    chessboard.style.gridTemplateRows = `repeat(${boardSize}, 50px)`;

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if ((row + col) % 2 === 0) {
                cell.classList.add('white');
            } else {
                cell.classList.add('black');
            }

            chessboard.appendChild(cell);
        }
    }

    // Knights memulai dari index ke [0,0]
    const startCell = chessboard.children[0];
    startCell.innerHTML = '<i class="fa-solid fa-chess-knight"></i>';
}

function solveBacktracking() {
    const boardSize = parseInt(document.getElementById('boardSize').value);
    const chessboard = document.getElementById('chessboard');
    const board = Array.from({ length: boardSize }, () => Array(boardSize).fill(-1));
    const moves = [
        [2, 1], [1, 2], [-1, 2], [-2, 1],
        [-2, -1], [-1, -2], [1, -2], [2, -1]
    ];

    function isSafe(x, y, board) {
        return (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y] === -1);
    }

    function solveKTUtil(x, y, movei, board, moves) {
        if (movei === boardSize * boardSize) return true;

        for (let k = 0; k < 8; k++) {
            const next_x = x + moves[k][0];
            const next_y = y + moves[k][1];
            if (isSafe(next_x, next_y, board)) {
                board[next_x][next_y] = movei;
                if (solveKTUtil(next_x, next_y, movei + 1, board, moves)) {
                    return true;
                } else {
                    // Memulai atau mencoba backtracking backtracking
                    board[next_x][next_y] = -1; 
                }
            }
        }
        return false;
    }

    function solveKT() {
        // Memulai memecahkan masalah dari index [0,0]
        board[0][0] = 0; 
        if (!solveKTUtil(0, 0, 1, board, moves)) {
            alert("Solution does not exist");
            return false;
        } else {
            animateSolution(board);
        }
    }

    solveKT();
}

function solveBranchAndBound() {
    const boardSize = parseInt(document.getElementById('boardSize').value);
    const chessboard = document.getElementById('chessboard');
    const board = Array.from({ length: boardSize }, () => Array(boardSize).fill(-1));
    const moves = [
        [2, 1], [1, 2], [-1, 2], [-2, 1],
        [-2, -1], [-1, -2], [1, -2], [2, -1]
    ];

    function isSafe(x, y, board) {
        return (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y] === -1);
    }

    function getDegree(x, y, board, moves) {
        let count = 0;
        for (let i = 0; i < moves.length; i++) {
            const nx = x + moves[i][0];
            const ny = y + moves[i][1];
            if (isSafe(nx, ny, board)) {
                count++;
            }
        }
        return count;
    }

    function nextMove(x, y, board, moves) {
        let min_deg_idx = -1, min_deg = (boardSize + 1), c, nx, ny;

        const start = Math.floor(Math.random() * moves.length);
        for (let count = 0; count < moves.length; ++count) {
            const i = (start + count) % moves.length;
            nx = x + moves[i][0];
            ny = y + moves[i][1];
            if (isSafe(nx, ny, board) && (c = getDegree(nx, ny, board, moves)) < min_deg) {
                min_deg_idx = i;
                min_deg = c;
            }
        }

        if (min_deg_idx === -1) {
            return [-1, -1];
        }

        nx = x + moves[min_deg_idx][0];
        ny = y + moves[min_deg_idx][1];

        board[nx][ny] = board[x][y] + 1;

        return [nx, ny];
    }

    function solveKT() {
        const sx = 0, sy = 0;
        board[sx][sy] = 0;
        let pos = 1;

        let [cx, cy] = [sx, sy];
        for (let i = 0; i < boardSize * boardSize - 1; ++i) {
            const [nx, ny] = nextMove(cx, cy, board, moves);
            if (nx === -1 && ny === -1) {
                alert("Solution does not exist");
                return false;
            }
            [cx, cy] = [nx, ny];
        }

        animateSolution(board);
        return true;
    }

    solveKT();
}

function animateSolution(board) {
    const chessboard = document.getElementById('chessboard');
    const boardSize = board.length;
    let knightPos = [0, 0];

    function highlightMove(step = 0) {
        if (step > 0) {
            const prevCellIndex = knightPos[0] * boardSize + knightPos[1];
            const prevCell = chessboard.children[prevCellIndex];
            prevCell.innerHTML = step - 1;
        }

        if (step < boardSize * boardSize) {
            const nextMove = getKnightPosition(board, step);
            knightPos = nextMove;
            const cellIndex = nextMove[0] * boardSize + nextMove[1];
            const cell = chessboard.children[cellIndex];
            cell.innerHTML = '<i class="fa-solid fa-chess-knight"></i>';
            setTimeout(() => highlightMove(step + 1), 500); 
        }
    }

    function getKnightPosition(board, step) {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === step) {
                    return [i, j];
                }
            }
        }
    }

    highlightMove();
}

function clearChessboard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.innerHTML = '';
    });
}
