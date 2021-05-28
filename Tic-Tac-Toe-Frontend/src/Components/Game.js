import { Alert } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import io from "socket.io-client";
import Square from "./Square";

let socket;

const Game = (props) => {
    const { roomId } = useParams();

    const [room, setRoom] = useState(roomId);
    const [roomFull, setRoomFull] = useState(false);
    const [noOfUsers, setNoOfUsers] = useState(0);
    const [squares, setSquares] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    // 0->empty, 1->cross, 2->circle
    const [board, setBoard] = useState([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]);
    const [symbol, setSymbol] = useState("");
    const [isTurn, setIsTurn] = useState(false);
    const [winner, setWinner] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        // socket = io("http://localhost:5000/");
        socket = io("/");

        socket.emit("join", { room: room }, (error) => {
            if (error) {
                setRoomFull(true);
            }
        });
    }, [room]);

    // runs once on initial render
    useEffect(() => {
        socket.on("currentUserSymbol", (mySymbol) => {
            setSymbol(mySymbol);
            if (mySymbol === "X") {
                setIsTurn(true);
            }
        });

        socket.on("updateGameState", ({ newBoard, symbol: lastSymbolUsed }) => {
            setBoard(newBoard);

            if (lastSymbolUsed === symbol) {
                setIsTurn(false);
            } else {
                setIsTurn(true);
            }

            checkWinner(newBoard);
            if (!isMovesLeft(newBoard)) {
                setIsGameOver(true);
                // setWinner("None");
            }
        });

        socket.on("roomData", ({ room, users }) => {
            console.log("Users are ", users);
            setNoOfUsers(users.length);
        });
    }, [isTurn, symbol, noOfUsers]);

    const squareClickHandler = (row, col) => {
        // console.log(`Square clicked is ${row}:${col}`);

        if (board[row][col] !== 0) {
            // console.log(`Square is already filled`);
            // alert("Square is already filled");
            return;
        }

        if (!isTurn) {
            alert("Not your turn");
            return;
        }

        let newBoard = [[...board[0]], [...board[1]], [...board[2]]];
        newBoard[row][col] = symbol === "X" ? 1 : 2;

        socket.emit("move", { newBoard, symbol });
    };

    const checkWinner = (board) => {
        // checking for rows
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                if (board[i][0] === 1) {
                    setWinner("Player-1");
                    setIsGameOver(true);
                } else if (board[i][0] === 2) {
                    setWinner("Player-2");
                    setIsGameOver(true);
                }
            }
        }

        // checking for cols
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                if (board[0][i] === 1) {
                    setWinner("Player-1");
                    setIsGameOver(true);
                } else if (board[0][i] === 2) {
                    setWinner("Player-2");
                    setIsGameOver(true);
                }
            }
        }

        // Checking for Diagonals
        if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            if (board[0][0] === 1) {
                setWinner("Player-1");
                setIsGameOver(true);
            } else if (board[0][0] === 2) {
                setWinner("Player-2");
                setIsGameOver(true);
            }
        }

        if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            if (board[0][2] === 1) {
                setWinner("Player-1");
                setIsGameOver(true);
            } else if (board[0][2] === 2) {
                setWinner("Player-2");
                setIsGameOver(true);
            }
        }
    };

    const isMovesLeft = (board) => {
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++) if (board[i][j] === 0) return true;
        return false;
    };

    if (roomFull) {
        return (
            <div className="container text-center">
                <h1>This room is full</h1>
            </div>
        );
    }

    return (
        <div className="container text-center">
            {/* <div>{roomFull && `room is full`}</div> */}
            <Alert variant="primary">
                Your room code is : <span className="display-6">{room}</span>
            </Alert>

            {!isGameOver && (
                <div className="container text-center">
                    <h5 className="display-6">{`Your symbol is ${symbol}`}</h5>
                    <h1>{isTurn ? `Your Turn` : `Opponent's Turn`}</h1>
                </div>
            )}

            {isGameOver && (
                <div className="container text-center mt-5">
                    <h1 className="text-dark">GAME OVER!</h1>
                    {winner === "Player-1" &&
                        (symbol === "X" ? <YouWin /> : <YouLose />)}
                    {winner === "Player-2" &&
                        (symbol === "0" ? <YouWin /> : <YouLose />)}
                    {winner === "" && <Draw />}
                    <Link to="/">
                        <button className="btn btn-lg btn-primary">
                            Go To Home
                        </button>
                    </Link>
                </div>
            )}

            {noOfUsers === 2 && (
                <div className="mt-5">
                    <div className="board">
                        {squares.map((squareIndex) => {
                            let row = Math.floor(squareIndex / 3);
                            let col = squareIndex % 3;
                            return (
                                <Square
                                    key={squareIndex}
                                    squareClickHandler={squareClickHandler}
                                    squareValue={board[row][col]}
                                    row={row}
                                    col={col}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const YouWin = () => {
    return <h1 className="text-success">You Win</h1>;
};

const YouLose = () => {
    return <h1 className="text-danger">You lose</h1>;
};

const Draw = () => {
    return <h1 className="text-primary">Draw!!</h1>;
};

export default Game;
