function createChessboard() {
    const boardSize = document.getElementById('boardSize').value;
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
}

// Initial call to create a default 8x8 chessboard
createChessboard();
