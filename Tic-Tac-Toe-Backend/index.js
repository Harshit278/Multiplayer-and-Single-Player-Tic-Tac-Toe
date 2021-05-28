const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");
const path = require("path");

const app = express();
// app.use(express.static(path.resolve(__dirname, "./client/build")));

const server = http.createServer(app);
const io = socketio(server, {
    cors: { origin: "*" },
});

// const rooms = new Map();

io.on("connection", (socket) => {
    console.log("New WS Connection", socket.id);

    // socket.emit("msg", { message: "hello bitches" });

    socket.on("join", (payload, callback) => {
        let numberOfUsersInRoom = getUsersInRoom(payload.room).length;

        const { error, newUser } = addUser({
            id: socket.id,
            name: numberOfUsersInRoom === 0 ? "Player 1" : "Player 2",
            room: payload.room,
        });

        if (error) {
            return callback(error);
        }

        socket.join(newUser.room);

        io.to(newUser.room).emit("roomData", {
            room: newUser.room,
            users: getUsersInRoom(newUser.room),
        });

        let symbol = newUser.name === "Player 1" ? "X" : "0";
        socket.emit("currentUserSymbol", symbol);

        callback();
    });

    socket.on("move", ({ newBoard, symbol }) => {
        const user = getUser(socket.id);
        if (user) {
            io.to(user.room).emit("updateGameState", { newBoard, symbol });
        }
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user)
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room),
            });
    });
});

// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
// });

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
