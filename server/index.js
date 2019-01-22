const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const massive = require("massive");
const controller = require("./controller");
require("dotenv").config();
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

massive(process.env.CONNECTION_STRING)
  .then(database => {
    app.set("db", database);
  })
  .catch(error => {
    console.log("error with massive", error);
  });

app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  maxAge: 1000 * 60 * 60 * 24 * 14
}));

// SOCKETS
let counter = 1;
let userList = [];
io.sockets.on("connection", socket => {
  let addedToList = false;
  Object.assign(socket, { user: {} });
  const { user } = socket;
  Object.assign(socket.user, { userId: counter });
  socket.emit("welcome", {
    user: socket.user,
    userList: userList
  });
  socket.on("join user", joinUser => {
    if (addedToList) return;
    console.log("User joined, join user:", joinUser.userInfo);
    Object.assign(socket.user, { userName: joinUser.userInfo.userName });
    if (userList.length === 0) {
      Object.assign(joinUser, { driver: true });
      Object.assign(socket.user, { driver: true });
    } else {
      Object.assign(joinUser, { driver: false });
      Object.assign(socket.user, { driver: false });
    }
    const { user } = socket;
    userList.push(user);
    console.log("User joined, userList:", userList);
    io.emit("user joined", {
      userList: userList
    });
    socket.emit("name welcome", {
      user: socket.user,
      userList: userList
    });
  });
  socket.on("ready user", readyUser => {
    console.log("User ready, readyUser:", readyUser);
    console.log("ready user, userList before", userList);
    Object.assign(socket.user, { isReady: readyUser.isReady });
    const { user } = socket;
    let newUser = removeUser(user.userId);
    console.log("newUser:", newUser);
    Object.assign(newUser[0], readyUser);
    userList.push(newUser[0]);
    console.log("ready user, userList after", userList);
    io.emit("user readied", {
      user: readyUser
    });
  });
  socket.on("clear ready on players", (user) => {
    // clearReadyOnPlayers();
    socket.emit("ready cleared on players", { user });
  });
  socket.on("game phase to server", message => {
    io.emit("game phase to user", { gamePhase: message.gamePhase });
    console.log("got game phase", message.gamePhase);
  });
  socket.on("QAList to server", message => {
    io.emit("QAList to user", { QAList: message.QAList });
    console.log("got QAList", message.QAList);
  });
  socket.on("roundScore to server", message => {
    console.log('ROUNDSCORE RAW DATA, message', message)
    io.emit("roundScore to host", { message });
    console.log("got roundScore", message);
  });
  function removeUser(userId) {
    let removed = {};
    for (i = userList.length - 1; i >= 0; i--) {
      if (
        userList[i]["userId"] === socket.user.userId &&
        socket.user.userId !== undefined
      ) {
        removed = userList.splice(i, 1);
        return removed;
      }
    }
  }
  // function clearReadyOnPlayers() {
  //   for (i = userList.length - 1; i >= 0; i--) {
  //     userList[i].isReady = false;
  //   }
  //   return userList;
  // }
  socket.on("disconnect", () => {
    console.log("User left, user:", removeUser(socket.user.userId));
    console.log("User left, userList:", userList);
  });
  counter++;
});

// RESTFUL METHODS
app.get("/api/TrivSet", controller.getTrivSet);
app.get("/api/MyTrivSet", controller.getMyTrivSet);
app.get("/api/MyTrivSetCreated", controller.getMyTrivCreated);
app.get("/api/TrivQASet", controller.getTrivQASet);
app.put(`/api/EditMyTrivSet/:id`, controller.editMyTrivSet);
app.delete(`/api/DeleteTrivSet/:id/:userid`, controller.deleteTrivSet);
app.post("/api/TrivList", controller.postTrivList);
app.post("/api/TrivSet", controller.postTrivSet);
app.post("/api/TrivCreator", controller.postTrivCreator);

app.post("/api/registerUser", controller.registerUser);
app.post("/api/login", controller.loginUser);
app.post("/api/logout", controller.logoutUser);
app.get("/api/getUsers", controller.getUsers)

const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

const PORT = 4000 || process.env.CONNECTION_STRING;
server.listen(PORT, () => console.log(`Sockets are listening on port ${PORT}`));

