import React, { Component } from "react";
import { connect } from "react-redux";
import {
  updateUser,
  updateUserList,
  updateTrivSwitch,
  updateNewsAllList,
  updateNewsMyList,
  updateNewsMyListCreated
} from "../ducks/reducer";
import { withRouter } from "react-router";
import UQA from "./UQA";
import socketIOClient from "socket.io-client";
//dvmtn
// var socket = socketIOClient("http://127.0.0.1:4000/"); // TESTING MODE, LAPTOP
//home
var socket = socketIOClient(); // PRODUCTION BUILD, DIGITAL OCEAN

class UserBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // user: {},
      userName: "",
      user: {},
      submitEntry: false,
      isReady: false,
      gamePhase: null,
      qaPlayingCurrent: null
    };
    // RECEIVE WELCOME
    socket.on("welcome", welcome => {
      console.log("UserBox.js, receiving welcome", welcome);
      const { user, userList } = welcome;
      this.setState({ user: user });
      this.props.updateUser(this.state.user);
      this.props.updateUserList(userList);
    });
    socket.on("name welcome", userJoin => {
      console.log("UserBox.js, receiving name welcome", userJoin);
      const { user, userList } = userJoin;
      this.setState({ user: user });
      this.props.updateUser(this.state.user);
      this.props.updateUserList(userList);
    });
    socket.on("game phase to user", message => {
      console.log("UserBox.js, receiving game phase", message);
      this.setState({ gamePhase: message.gamePhase });
    });
    socket.on("QAList to user", message => {
      console.log("UserBox.js, receiving QAList", message);
      this.setState({ qaPlayingCurrent: message.QAList });
    });
  }
  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };
  handleSubmit = () => {
    let userInfo = {
      userId: this.props.user.userId,
      userName: this.state.userName
    };
    this.props.updateUser(userInfo);
    this.setState({
      submitEntry: true
    });
    socket.emit("join user", { userInfo });
    console.log("UserBox join user", this.props.user, this.state.userName);
    // console.log(UserBox, submit, )
  };
  handleReady = () => {
    const { userId } = this.props.user;
    this.setState({
      isReady: !this.state.isReady
    });
    // let newUser = {...this.state.user)
    // Object.assign(newUser, {'isReady': this.state.isReady})

    socket.emit("ready user", {
      isReady: !this.state.isReady,
      userId: userId
    });
    // console.log('sent ready user message')
  };

  render() {
    console.log("UserBox, this.props.user", this.props.user);
    const {
      userName,
      userCheck,
      gameStart,
      gamePhase,
      qaPlayingCurrent,
      submitEntry,
      isReady
    } = this.state;
    // console.log('----------- state', this.state)
    // console.log('----------- props', this.props)
    return (
      <div>
        <h1>User Box</h1>
        {gamePhase === null && this.props.userList.length >= 8 ? (
          <>
            <h2>Game is Full</h2>{" "}
          </>
        ) : gamePhase === null && !submitEntry ? (
          <>
            <h2>Username:</h2>
            <input
              type="text"
              name={"userName"}
              value={userName}
              onChange={this.handleChange}
            />
            {userCheck ? this.checkItemMsg() : <p />}
            <button onClick={this.handleSubmit}>Submit</button>{" "}
          </>
        ) : gamePhase === null ? (
          <>
            <h2>Ready?</h2>
            <button
              className={isReady ? "ready-btn-on" : "ready-btn-off"}
              onClick={this.handleReady}
            >
              Click when ready to play
            </button>{" "}
          </>
        ) : gamePhase === 1 ? (
          <>
            <UQA
              socket={socket}
              gamePhase={gamePhase}
              qaPlayingCurrent={qaPlayingCurrent}
            />
          </>
        ) : gamePhase === 2 ? (
          <>
            <UQA
              socket={socket}
              gamePhase={gamePhase}
              qaPlayingCurrent={qaPlayingCurrent}
            />
          </>
        ) : (
                    <></>
                  )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  const {
    user,
    userList,
    gameStart,
    gamePhase,
    trivSwitch,
    newsAllList,
    newsMyList,
    newsMyListCreated
  } = state;
  return {
    user,
    userList,
    gameStart,
    gamePhase,
    trivSwitch,
    newsAllList,
    newsMyList,
    newsMyListCreated
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    {
      updateUser,
      updateUserList,
      updateTrivSwitch,
      updateNewsAllList,
      updateNewsMyList,
      updateNewsMyListCreated
    }
  )(UserBox)
);
