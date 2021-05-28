import React from "react";
import { useState } from "react";
import Square from "./Square";
import { findBestMove } from "../utilities/ComputerAI";
import { Link } from "react-router-dom";

const Computer = () => {
    const [squares, setSquares] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    // 0->empty, 1->cross, 2->circle
    const [squareValues, setSquareValues] = useState([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]);
    const [isComputerTurn, setisComputerTurn] = useState(false);
    const [computerSymbol, setComputerSymbol] = useState();
    const [hasGameStarted, setHasGameStarted] = useState(false);
    const [humanSymbol, setHumanSymbol] = useState();
    const [winner, setWinner] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);
    console.log("Component rerendered");

    const isMovesLeft = (board) => {
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++) if (board[i][j] === 0) return true;
        return false;
    };
    const checkWinner = (board) => {
        console.log("Check winner is callled");
        console.log("Square values is : ", board);
        // checking for rows
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                if (board[i][0] === computerSymbol) {
                    setWinner("Computer");
                    setIsGameOver(true);
                } else if (board[i][0] === humanSymbol) {
                    setWinner("Human");
                    setIsGameOver(true);
                }
            }
        }

        // checking for cols
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                if (board[0][i] === computerSymbol) {
                    setWinner("Computer");
                    setIsGameOver(true);
                } else if (board[0][i] === humanSymbol) {
                    setWinner("Human");
                    setIsGameOver(true);
                }
            }
        }

        // Checking for Diagonals
        if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            if (board[0][0] === computerSymbol) {
                setWinner("Computer");
                setIsGameOver(true);
            } else if (board[0][0] === humanSymbol) {
                setWinner("Human");
                setIsGameOver(true);
            }
        }

        if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            if (board[0][2] === computerSymbol) {
                setWinner("Computer");
                setIsGameOver(true);
            } else if (board[0][2] === humanSymbol) {
                setWinner("Human");
                setIsGameOver(true);
            }
        }
    };

    if (isComputerTurn) {
        if (isGameOver) return;
        // Computer's turn
        let [bestRow, bestCol] = findBestMove(
            computerSymbol,
            humanSymbol,
            squareValues
        );
        console.log(`Best move is row: ${bestRow}, col: ${bestCol}`);

        if (bestRow === -1 || bestCol === -1) {
            setisComputerTurn(false);
            checkWinner(squareValues);
            // console.log(`Inside if`, squareValues);
            if (!isMovesLeft(squareValues)) {
                setIsGameOver(true);
                setWinner("None");
            }
            return;
        }

        let newSquareValues = [
            [...squareValues[0]],
            [...squareValues[1]],
            [...squareValues[2]],
        ];
        newSquareValues[bestRow][bestCol] = computerSymbol;
        setSquareValues(newSquareValues);
        checkWinner(newSquareValues);
        // draw and last turn was computer's
        if (!isMovesLeft(newSquareValues)) {
            setIsGameOver(true);
        }
        console.log("Winner is " + winner);
        setisComputerTurn(false);
    }

    const squareClickHandler = (row, col) => {
        console.log(`row: ${row}, col: ${col}`);

        // The square is already filled
        if (squareValues[row][col] !== 0) {
            console.log(`Square is already filled`);
        } else if (!isComputerTurn) {
            let newSquareValues = [
                [...squareValues[0]],
                [...squareValues[1]],
                [...squareValues[2]],
            ];
            newSquareValues[row][col] = humanSymbol;
            setSquareValues(newSquareValues);
            checkWinner(newSquareValues);

            console.log("Winner is " + winner);
            setisComputerTurn(true);
        }
    };

    return (
        <div className="container">
            <div className="text-center mt-5">
                <button
                    className="btn btn-primary mr-3"
                    onClick={(e) => {
                        setisComputerTurn(false);
                        setComputerSymbol(2);
                        setHumanSymbol(1);
                        setHasGameStarted(true);
                    }}
                >
                    Play as X
                </button>
                <span> {} </span>
                <button
                    className="btn btn-primary"
                    onClick={(e) => {
                        setisComputerTurn(true);
                        setComputerSymbol(1);
                        setHumanSymbol(2);
                        setHasGameStarted(true);
                    }}
                >
                    Play as 0
                </button>
            </div>

            {isGameOver && (
                <div className="container text-center mt-5">
                    <h1 className="text-info">GAME OVER!</h1>
                    {winner === "Computer" ? (
                        <ComputerWins />
                    ) : winner === "Player" ? (
                        <PlayerWins />
                    ) : (
                        <Draw />
                    )}
                    <Link to="/">
                        <button className="btn btn-lg btn-primary">
                            Go To Home
                        </button>
                    </Link>
                </div>
            )}

            {hasGameStarted && (
                <div className="board mt-5">
                    {squares.map((squareIndex) => {
                        let row = Math.floor(squareIndex / 3);
                        let col = squareIndex % 3;
                        return (
                            <Square
                                key={squareIndex}
                                squareClickHandler={squareClickHandler}
                                squareValue={squareValues[row][col]}
                                row={row}
                                col={col}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const PlayerWins = () => {
    return <h2 className="text-success display-5">You Win</h2>;
};

const ComputerWins = () => {
    return <h2 className="text-danger display-5">You lose</h2>;
};

const Draw = () => {
    return <h2 className="text-primary display-5">Draw!!</h2>;
};

export default Computer;
