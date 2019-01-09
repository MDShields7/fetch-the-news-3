import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
  updateRndCurrent,
  updateNewsPlayingList,
  updateQAPlayingList,
  updateQAPlayingCurrent,
  updateNewsPlayedList,
  updateGameStart,
  updateGameEnd,
  updateGamePhase,
  updateGameTimer,
  updateGameTimerStart
} from "../../ducks/reducer";
import { withRouter } from "react-router";
import HGameTimer from "./HGameTimer";
import HScore from "./HScore";

import HQA from "./HQA";

class HLobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // gameTimerState: null,
      // timerSet: true,
      userList: []
    };
    this.countDown = this.countDown.bind(this);
    const { socket } = props;
    socket.on("welcome", welcome => {
      console.log("HostBox, receiving welcome", welcome);
      this.setState({
        userList: welcome.userList
      });
    });
    socket.on("name welcome", userJoin => {
      console.log("HostBox.js, receiving name welcome", userJoin);
    });
    socket.on("user joined", message => {
      console.log("HostBox.js, receiving user join message", message.userList);
      this.setState({
        userList: message.userList
      });
    });
    socket.on("user readied", message => {
      console.log("HLobby.js, receiving user ready message", message);
      this.setState({
        userList: message.userList
      });
    });
    socket.on("ready cleared on players", message => {
      console.log(
        "HLobby.js, receiving ready cleared on players message",
        message
      );
      this.setState({
        userList: message.userList
      });
    });
    socket.on("roundScore to host", message => {
      console.log(
        "--------****------- HLobby.js, roundScore", "got roundScore",
        // message.message,
        message.message.user.userName,
        message.message.user.roundScore
      );
      console.log("message.message.user:", message.message.user);
      // console.log("this.props.userList:", props.userList)
      this.addRoundScore(message.message.user.userId, message.message.user.roundScore)
    });
  }
  addRoundScore = (id, score) => {
    const { userList } = this.state;
    console.log("***********  HLobby, userList BEFORE addRoundScore", this.state.userList);
    let userListCopy = [...userList];
    console.log("***********  HLobby, userListCopy", userListCopy);
    let newUserList = [];
    userListCopy.map(user => {
      const { userId } = user;
      let newUser;
      if (userId === id && score !== undefined) {
        newUser = Object.assign({}, user, { roundScore: score })
        // console.log('newUser is:', newUser)
        newUserList.push(newUser)
      } else if (userId === id && user.roundScore === undefined) {
        newUser = Object.assign({}, user, { roundScore: 0 })
        // console.log('newUser is:', newUser)
        newUserList.push(newUser)
      }
      console.log("HLobby, addRoundScore, newUserList", newUserList);
      this.setState({ userList: newUserList })
    })
  }
  totalScores = () => {
    // Does not save scores back into userlist
    const { userList } = this.state;
    console.log("HLobby, userList before addScore", userList);
    let userListCopy = [...userList];
    for (let i = userListCopy.length - 1; i >= 0; i--) {
      userListCopy[i].totalScore += userListCopy[i].roundScore;
      userListCopy[i].roundScore = 0;
    }
    let newList = [];
    this.playerSortTotal(userListCopy);
    console.log(this.playerSortTotal(userListCopy));
    newList = userListCopy;
    console.log(
      "HLobby, userListCopy after addScore, before playerSortTotal",
      userListCopy
    );
    console.log("HLobby, newList after playerSortTotal", newList);
  };
  playerSortTotal = arr => {
    let newArr = arr.sort((a, b) => {
      return b.totalScore - a.totalScore;
    });
    console.log("playersorttotal", newArr);
  };

  getTriviaQA = async () => {
    const { newsPlayingList } = this.props;
    await axios
      .get("/api/TrivQASet", {
        params: { catId: newsPlayingList.cat_id }
      })
      .then(res => {
        console.log("getTriviaQA", res.data);
        this.props.updateQAPlayingList(res.data);
      })
      .catch(err => {
        console.log("HLobby, getTriviaQA, error", err);
      });
    this.nextQAPlayingList();
  };
  nextQAPlayingList = () => {
    console.log("----------------------------");
    const { qaPlayingCurrent, qaPlayingList } = this.props;
    // if (qaPlayingCurrent.length === 0) {
    //   // Loading questions if first round
    //   console.log("HLobby, qaPlayingList", qaPlayingList);
    //   console.log("HLobby, qaPlayingCurrent", qaPlayingCurrent);
    //   let qaPlayingListCopy = qaPlayingList.slice();
    //   let item = qaPlayingListCopy.shift();
    //   this.loadCurrentQA(item, qaPlayingListCopy);
    //   console.log("HLobby, qaPlayingList after", qaPlayingList);
    //   console.log("HLobby, qaPlayingCurrent after", qaPlayingCurrent);
    // } else
    if (qaPlayingList.length >= 1) {
      // Loading questions if any rounds remaining
      console.log(
        "HLobby, nextQAPlayingList func, qaPlayingList[0]",
        qaPlayingList
      );
      let item = qaPlayingList.shift();
      console.log("item is", item);
      this.loadCurrentQA(item, qaPlayingList);
    }
  };
  loadCurrentQA = (qa, qaList) => {
    const {
      updateQAPlayingList,
      updateQAPlayingCurrent
    } = this.props;
    qa = this.reorderQA(qa);
    console.log("HLobby, loadCurrentQA func, qa:", qa, "qaPlayingList", qaList);
    updateQAPlayingCurrent(qa);
    updateQAPlayingList(qaList);
    this.sendQAList(qa);
  };
  sendQAList = list => {
    console.log("sending question & answer to server", list);
    this.props.socket.emit("QAList to server", {
      QAList: list
    });
  };
  reorderQA = item => {
    // console.log('item', item)
    let newItem = {};
    let ansArr = [];
    ansArr.push(item.qa_ans1);
    ansArr.push(item.qa_ans2);
    ansArr.push(item.qa_ans3);
    ansArr.push(item.qa_ans4);
    newItem = {
      id: item.qa_id,
      question: item.qa_question,
      list: this.scrambleFn(ansArr)
    };
    return newItem;
  };
  scrambleFn = list => {
    let answerList = list.slice();
    let answerKeyList = [true, false, false, false];
    let ansRandom = [];
    let ansKeyRandom = [];
    return this.realScramble(
      answerList,
      answerKeyList,
      ansRandom,
      ansKeyRandom
    );
  };
  realScramble = (arr1, arr2, arr3, arr4) => {
    let randomNum = Math.floor(Math.random() * arr1.length);
    let item = arr1.splice(randomNum, 1);
    let itemKey = arr2.splice(randomNum, 1);
    arr3.push(item[0]);
    arr4.push(itemKey[0]);
    if (!arr1[0]) {
      let answers = Object.assign({ ansRandom: arr3, ansKeyRandom: arr4 }, {});
      console.log("HLobby, scrambleFn result is", answers);
      return answers;
    }
    return this.realScramble(arr1, arr2, arr3, arr4);
  };

  countDown() {
    const { gameTimer, gameStart, gameEnd } = this.props;
    if (gameTimer < 0) {
      this.props.updateGameTimer(null);
    } else if (gameTimer === 0 && gameStart === true) {
      this.setupPhase();
    } else if (gameStart === true) {
      this.props.updateGameTimer(gameTimer - 1);
      setTimeout(() => this.countDown(), 1000);
    }
  }
  clearReady = () => {
    this.props.socket.emit("clear ready on players", {
      clearReady: "yes please"
    });
  };
  sendGamePhase = phase => {
    console.log("sending game phase to user --------", phase);
    this.props.socket.emit("game phase to server", {
      gamePhase: phase
    });
  };

  startGame = async () => {
    console.log("!!!! startgame !!!!!");
    await this.props.updateGameStart(true);
    this.setupPhase();
  };
  setupPhase = async () => {
    console.log("!!!! setupphase !!!!!");
    const {
      gameStart,
      gamePhase,
      rndCurrent,
      rndLimit,
      updateRndCurrent
    } = this.props;
    let phaseTime = [5, 2, 20, 2]; // Array of phase timer amounts
    console.log(`changing phase from ${gamePhase} to ${gamePhase + 1}`);
    if (gamePhase === 0) {
      // Game not started condition
      await this.setupGame(); // Game setup, QAs
      this.phaseChange(phaseTime[0]); // Phase setup, start
    } else if (gamePhase === 4) {
      let nextRound = rndCurrent + 1;
      if (nextRound < rndLimit) {
        console.log(`changing round from ${rndCurrent} to ${rndCurrent + 1}`);
        updateRndCurrent(nextRound); // Change round
        this.phaseChange(phaseTime[0]); //  Start round, phase
      } else if (nextRound === rndLimit) {
        this.endGame();
      }
    } else {
      this.phaseChange(phaseTime[gamePhase]);
    }
  };
  setupGame = async () => {
    await this.getTriviaQA();
    // await updateNewsPlayedList(newsPlayingList.cat_name.slice());
    this.props.updateRndCurrent(1);
  };
  phaseChange = async time => {
    console.log("!!!! phasechange !!!!!");
    const {
      gamePhase,
      updateGamePhase,
      updateGameTimer,
      updateGameTimerStart
    } = this.props;
    let phaseNumber;
    gamePhase === 4 ? (phaseNumber = 1) : (phaseNumber = gamePhase + 1);
    if (phaseNumber === 4) {
      this.totalScores();
    }
    await this.clearReady();
    updateGamePhase(phaseNumber);
    this.sendGamePhase(phaseNumber);
    await updateGameTimer(time);
    await updateGameTimerStart(time);
    this.countDown();
  };
  endGame = () => {
    const { updateGameEnd } = this.props;
    updateGameEnd(true);
  };
  render() {
    const {
      socket,
      gameStart,
      gameEnd,
      gamePhase,
      gameTimer,
      rndCurrent,
      rndLimit,
      updateRndCurrent,
      updateGameStart,
      updateGameEnd,
      updateGamePhase
    } = this.props;
    const { userList } = this.state;
    console.log(
      "gameStart:",
      gameStart,
      "rndCurrent:",
      rndCurrent,
      "gamePhase:",
      gamePhase,
      "gameTimer:",
      gameTimer
    );
    console.log("HLobby, state", this.state);
    console.log("HLobby, state, userList", this.state.userList);
    console.log("HLobby, props", this.props);
    const Lobby = (
      <div className="lobby">
        <div className="list">
          Category: {this.props.newsPlayingList.cat_name}
        </div>
        <div className="roundNum">{this.props.rndLimit} rounds</div>
        <button className="start-game" onClick={this.startGame}>
          Start
        </button>
      </div>
    );
    const gameOver = <h1>Game Over</h1>;
    const Users = (
      <div className={!gameStart ? "lobby-footer" : "lobby-footer-sml"}>
        <div className="lobby-player-arr">
          {userList ? (
            userList.map((elem, index) => {
              return (
                <div key={index} className={!gameStart ? "player-box" : "player-box-sml"}>
                  <div
                    className={elem.isReady ? "player-text-r" : "player-text"}
                  >
                    {elem.userName}
                  </div>
                </div>
              );
            })
          ) : (
              <></>
            )}
        </div>
      </div>
    );
    return (
      <div className='HLobby'>
        {!gameStart ? (
          <>
            {Lobby}
            {Users}
          </>
        ) : gameStart && gameEnd ? (
          <>{gameOver}</>
        ) : gamePhase === 1 ? (
          <>
            <HQA />
            <HGameTimer userList={this.state.userList} />
            {Users}
          </>
        ) : gamePhase === 2 ? (
          <>
            <HQA />
            {Users}{" "}
          </>
        ) : gamePhase === 3 || gamePhase === 4 ? (
          <HScore gamePhase={gamePhase} userList={this.state.userList} />
        ) : (
                    <div>NO COMPONENT LOADED</div>
                  )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  const {
    id,
    newsMyList,
    newsPlayingList,
    qaPlayingList,
    qaPlayingCurrent,
    newsPlayedList,
    rndLimit,
    rndCurrent,
    gameStart,
    gameEnd,
    gamePhase,
    gameTimer,
    gameTimerStart
  } = state;
  return {
    id,
    newsMyList,
    newsPlayingList,
    qaPlayingList,
    qaPlayingCurrent,
    newsPlayedList,
    rndLimit,
    rndCurrent,
    gameStart,
    gameEnd,
    gamePhase,
    gameTimer,
    gameTimerStart
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    {
      updateRndCurrent,
      updateNewsPlayingList,
      updateQAPlayingList,
      updateQAPlayingCurrent,
      updateNewsPlayedList,
      updateGameStart,
      updateGameEnd,
      updateGamePhase,
      updateGameTimer,
      updateGameTimerStart
    }
  )(HLobby)
);
