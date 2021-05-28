// import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Computer from "./Components/Computer";
import Home from "./Components/Home";
import JoinGame from "./Components/JoinGame";
import Game from "./Components/Game";
import "./App.css";

function App() {
    return (
        <Router>
            <div className="container">
                <h1 className="text-center mt-5 display-3">Tic Tac Toe</h1>
            </div>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/vsComputer">
                    <Computer />
                </Route>
                <Route exact path="/joinGame">
                    <JoinGame />
                </Route>
                <Route path="/game/:roomId">
                    <Game />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
