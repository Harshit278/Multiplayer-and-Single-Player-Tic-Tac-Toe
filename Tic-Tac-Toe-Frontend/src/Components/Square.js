import React from "react";
// import "./App.css";
import cross from "../assets/kata.png";
import circle from "../assets/circle.png";

const Square = ({ squareClickHandler, squareValue, row, col }) => {
    const CrossImage = () => {
        return <img src={cross} alt="cross" />;
    };

    const CircleImage = () => {
        return <img src={circle} alt="circle" />;
    };

    // console.log(`Square No ${squareId}`);
    return (
        <div
            className="square text-center bg-info"
            onClick={() => {
                squareClickHandler(row, col);
            }}
        >
            {squareValue === 0 ? (
                ""
            ) : squareValue === 1 ? (
                <CrossImage />
            ) : (
                <CircleImage />
            )}
        </div>
    );
};

export default Square;
