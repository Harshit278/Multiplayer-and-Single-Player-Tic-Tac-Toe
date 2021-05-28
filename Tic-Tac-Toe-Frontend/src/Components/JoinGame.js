import React, { useState } from "react";
import { Link } from "react-router-dom";

const JoinGame = () => {
    const [roomName, setRoomName] = useState("");
    return (
        <div className="container text-center mt-5">
            <form>
                <input
                    type="text"
                    name="roomName"
                    id="roomName"
                    value={roomName}
                    onChange={(e) => {
                        setRoomName(e.target.value);
                    }}
                />
                <div></div>
                <Link to={`/game/${roomName}`}>
                    <button className="btn btn-primary mt-3" type="submit">
                        Join Room
                    </button>
                </Link>
            </form>
        </div>
    );
};

export default JoinGame;
