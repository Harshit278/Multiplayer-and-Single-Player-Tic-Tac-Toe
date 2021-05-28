import React from "react";
import { Link } from "react-router-dom";
import generateString from "../utilities/randomCodeGenerator.js";
// import "./App.css";
import { Button, DropdownButton, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
    return (
        <div className="container text-center mt-5">
            <DropdownButton
                id="dropdown-basic-button"
                title="Create Game"
                size="lg"
                variant="success"
            >
                <Dropdown.Item href="/vsComputer">
                    {/* <Link to="vsComputer">vs Computer</Link> */}
                    <Button variant="">vs Computer</Button>
                </Dropdown.Item>
                <Dropdown.Item href={`/game/${generateString(5)}`}>
                    {/* <Link to={`/game/${generateString(5)}`}> vs Player</Link> */}
                    <Button variant="">vs Player</Button>
                </Dropdown.Item>
            </DropdownButton>

            <Link to="/joinGame">
                {" "}
                <Button className="mt-5" size="lg">
                    Join Game
                </Button>{" "}
            </Link>
        </div>
    );
};

export default Home;
