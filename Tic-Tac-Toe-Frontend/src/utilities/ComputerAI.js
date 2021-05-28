// This function returns true if there are moves
// remaining on the board. It returns false if
// there are no moves left to play.
function isMovesLeft(board) {
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++) if (board[i][j] === 0) return true;
    return false;
}

function evaluate(b, computerSign, humanSign) {
    // Checking for Rows for X or O victory.
    for (let row = 0; row < 3; row++) {
        if (b[row][0] === b[row][1] && b[row][1] === b[row][2]) {
            if (b[row][0] === computerSign) return +10;
            else if (b[row][0] === humanSign) return -10;
        }
    }

    // Checking for Columns for X or O victory.
    for (let col = 0; col < 3; col++) {
        if (b[0][col] === b[1][col] && b[1][col] === b[2][col]) {
            if (b[0][col] === computerSign) return +10;
            else if (b[0][col] === humanSign) return -10;
        }
    }

    // Checking for Diagonals for X or O victory.
    if (b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
        if (b[0][0] === computerSign) return +10;
        else if (b[0][0] === humanSign) return -10;
    }

    if (b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
        if (b[0][2] === computerSign) return +10;
        else if (b[0][2] === humanSign) return -10;
    }

    // Else if none of them have won then return 0
    return 0;
}

function minimax(board, depth, isMax, computerSign, humanSign) {
    let score = evaluate(board, computerSign, humanSign);
    // If Maximizer has won the game return his/her
    // evaluated score
    if (score === 10) return score;

    // If Minimizer has won the game return his/her
    // evaluated score
    if (score === -10) return score;

    // If there are no more moves and no winner then
    // it is a tie
    if (isMovesLeft(board) === false) return 0;

    // If this maximizer's move
    if (isMax) {
        let best = -1000;

        // Traverse all cells
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Check if cell is empty
                if (board[i][j] === 0) {
                    // Make the move
                    board[i][j] = computerSign;

                    // Call minimax recursively and choose
                    // the maximum value
                    best = Math.max(
                        best,
                        minimax(
                            board,
                            depth + 1,
                            !isMax,
                            computerSign,
                            humanSign
                        )
                    );

                    //     // Undo the move
                    board[i][j] = 0;
                }
            }
        }
        return best;
    }

    // If this minimizer's move
    else {
        let best = 1000;

        // Traverse all cells
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Check if cell is empty
                if (board[i][j] === 0) {
                    // Make the move
                    board[i][j] = humanSign;

                    // Call minimax recursively and choose
                    // the minimum value
                    best = Math.min(
                        best,
                        minimax(
                            board,
                            depth + 1,
                            !isMax,
                            computerSign,
                            humanSign
                        )
                    );

                    // Undo the move
                    board[i][j] = 0;
                }
            }
        }
        return best;
    }
}

export function findBestMove(computerSign, humanSign, board) {
    let bestVal = -1000;
    let bestRow = -1;
    let bestCol = -1;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // check if cell is empty
            if (board[i][j] === 0) {
                // Make the move
                board[i][j] = computerSign;

                // compute evaluation function for this
                // move.
                const moveVal = minimax(
                    board,
                    0,
                    false,
                    computerSign,
                    humanSign
                );

                // Undo the move
                board[i][j] = 0;

                // If the value of the current move is
                // more than the best value, then update
                // best/
                if (moveVal > bestVal) {
                    bestRow = i;
                    bestCol = j;
                    bestVal = moveVal;
                }
            }
        }
    }

    return [bestRow, bestCol];
}
