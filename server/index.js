const express = require("express");
const bodyParser = require("body-parser");
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
app.use(express.static(`${__dirname}/../build`));

// SOCKETS
let counter = 1;
// let userList = []
let userList = [];
//     {userId: 0, userName: 'Jose', isReady: false, roundScore: 100, totalScore:500},
//     {userId: 1, userName: 'Nathaniel', isReady: true, roundScore: 0, totalScore:400},
//     {userId: 2, userName: 'Emilia', isReady: true, roundScore: 200, totalScore:100},
//   {userId: 3, userName: 'Francois', isReady: false, roundScore: 0, totalScore:200},
//   {userId: 4, userName: 'Xixi', isReady: true, roundScore: 0, totalScore:300},
//   {userId: 5, userName: 'Jay', isReady: true, roundScore: 100, totalScore:300},
//   {userId: 6, userName: 'Bill', isReady: true, roundScore: 100, totalScore:300},
//   {userId: 7, userName: 'Juan', isReady: false, roundScore: 100, totalScore:400},
// ]

io.sockets.on("connection", socket => {
  let addedToList = false;
  Object.assign(socket, { user: {} });
  // console.log('socket.user', socket.user)
  const { user } = socket;
  Object.assign(socket.user, { userId: counter });
  // console.log('socket.user', socket.user.userId)
  // console.log('user connected, user:', user)
  socket.emit("welcome", {
    user: socket.user, // userId
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
    console.log("newUser:", newUser[0]);
    Object.assign(newUser[0], readyUser);
    userList.push(newUser[0]);
    console.log("ready user, userList after", userList);
    io.emit("user readied", {
      user: readyUser
    });
  });
  socket.on("clear ready on players", () => {
    clearReadyOnPlayers();
    // console.log("Index.js clearing ready on players, result", userList);
    socket.emit("ready cleared on players", {
      userList: userList
    });
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
    console.log(
      "got roundScore",
      message,
      // message.user.userName,
      // message.user.roundScore
    );
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
  function clearReadyOnPlayers() {
    for (i = userList.length - 1; i >= 0; i--) {
      userList[i].isReady = false;
    }
    return userList;
  }
  socket.on("disconnect", () => {
    console.log("User left, user:", removeUser(socket.user.userId));
    // console.log('User left, user:', discon)
    console.log("User left, userList:", userList);
    // console.log('User left, userList:', userList)
  });
  counter++;
});

// RESTFUL METHODS
app.get("/api/TrivSet", controller.getTrivSet); //FUNCTIONS
app.get("/api/MyTrivSet", controller.getMyTrivSet); //FUNCTIONS
app.get("/api/MyTrivSetCreated", controller.getMyTrivCreated);
app.get("/api/TrivQASet", controller.getTrivQASet);
//FUNCTIONS
app.put(`/api/EditMyTrivSet/:id`, controller.editMyTrivSet); //FUNCTIONS
app.delete(`/api/DeleteTrivSet/:id/:userid`, controller.deleteTrivSet); //FUNCTIONS
app.post("/api/TrivList", controller.postTrivList); //FUNCTIONS
app.post("/api/TrivSet", controller.postTrivSet); //FUNCTIONS
app.post("/api/TrivCreator", controller.postTrivCreator); //FUNCTIONS

const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

const PORT = 4000 || process.env.CONNECTION_STRING;
server.listen(PORT, () => console.log(`Sockets are listening on port ${PORT}`));
// app.listen(4000, ()=> console.log(`REST is listening on port 4000`))
// server.listen(4000,()=>{
//   console.log('listening on 4000 🦖');
// })
