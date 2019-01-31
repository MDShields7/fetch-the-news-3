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
      phaseTime: [15, 5, 4, 4],
      userList: [],
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
      console.log(
        "HLobby.js, receiving ready cleared on players message",
        message, message.user.userId, message.user.isReady
      );
      this.addUserProperty(message.user.userId, 'isReady', message.user.isReady)
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
      this.addRoundScore(message.message.user.userId, message.message.user.roundScore)
    });
  }
  addRoundScore = (id, score) => {
    const { rndCurrent } = this.props;
    console.log("***********  HLobby, addRoundScore, id & score", id, score);
    console.log("***********  HLobby, userList", this.state.userList);
    let userListCopy = [...this.state.userList];
    console.log("***********  HLobby, userListCopy", userListCopy);
    userListCopy.map(async user => {
      const { userId } = user;
      // let newUser;
      if (rndCurrent === 1 && user.roundScore === undefined) {
        console.log('????????? addUserProperty called case 1, userId', userId, 'roundScore', 0)
        await this.addUserProperty(userId, 'roundScore', 0)
        await this.addUserProperty(userId, 'totalScore', 0)
      }
      if (userId === id && score !== undefined) {
        console.log('????????? addUserProperty called case 2, userId', userId, 'roundScore', score)
        await this.addUserProperty(userId, 'roundScore', score)
        if (rndCurrent === 1) {
          await this.addUserProperty(userId, 'totalScore', 0)
        }
      }
    })
    console.log("HLobby, addRoundScore, this.state.userList", this.state.userList);
  }
  addTotalScore = () => {
    const { userList } = this.state;
    console.log("HLobby, addTotalScore, userList BEFORE", userList);
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
      "HLobby, userListCopy after addTotalScore, after playerSortTotal",
      userListCopy
    );
    console.log("HLobby, newList after playerSortTotal", newList);
    this.setState({ userList: newList })
  };
  playerSortTotal = arr => {
    let newArr = arr.sort((a, b) => {
      return b.totalScore - a.totalScore;
    });
    // console.log("playersorttotal", newArr);
  };
  addUserProperty = (id, propKey, propValue) => {
    const { userList } = this.state;
    let userListCopy = [...userList];
    // console.log("%%%%%___%%%%%___%%%%%  HLobby, addUserProperty, id", id, 'Key:', propKey, 'Value', propValue);
    let newUserList = [];
    userListCopy.map(user => {
      const { userId } = user;
      let newUser;
      if (userId === id) {
        newUser = Object.assign({}, user, { [propKey]: propValue })
        // console.log('newUser is:', newUser)
        newUserList.push(newUser)
      } else {
        newUserList.push(user)
      }
      // console.log("HLobby, addUserProperty, newUserList", newUserList)
    })
    this.setState({ userList: newUserList })
  }
  getTriviaQA = async () => {
    const { newsPlayingList } = this.props;
    await axios
      .get("/api/TrivQASet", {
        params: { catId: newsPlayingList.cat_id }
      })
      .then(res => {
        console.log("getTriviaQA", res.data);
        console.log("getTriviaQA, res.data[0]", res.data[0]);
        console.log("getTriviaQA, res.data[1]", res.data[1]);
        this.props.updateQAPlayingList(res.data);
      })
      .catch(err => {
        console.log("HLobby, getTriviaQA, error", err);
      });
    this.nextQAPlayingList();
  };
  nextQAPlayingList = () => {
    console.log("----------------------------");
    const { qaPlayingList } = this.props;
    if (qaPlayingList.length >= 1) {
      let qaList = qaPlayingList.slice()
      let item = qaList.shift();
      this.loadCurrentQA(item, qaList);
    }
  };
  loadCurrentQA = (qa, qaList) => {
    const {
      updateQAPlayingList,
      updateQAPlayingCurrent
    } = this.props;
    qa = this.reorderQA(qa);
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
    const { phaseTime } = this.state;
    console.log(`changing phase from ${gamePhase} to ${gamePhase + 1}`);
    if (gamePhase === 0) {
      // Game not started condition
      await this.setupGame(); // Game setup, QAs
      this.phaseChange(phaseTime[0]); // Phase setup, start
    } else if (gamePhase === 4) {
      let nextRound = rndCurrent + 1;
      if (nextRound === rndLimit) {
        console.log(`changing round from ${rndCurrent} to ${rndCurrent + 1}`);
        updateRndCurrent(nextRound); // Change round
        this.phaseChange(phaseTime[0]); //  Start round, phase
      } else if (nextRound > rndLimit) {
        this.endGame();
      }
    } else {
      this.phaseChange(phaseTime[gamePhase]);
    }
  };
  setupGame = async () => {
    await this.getTriviaQA();
    this.props.updateRndCurrent(1);
  };
  phaseChange = async time => {
    console.log("!!!! phasechange !!!!!");
    const {
      updateGamePhase,
      updateGameTimer,
      updateGameTimerStart
    } = this.props;
    let phaseNumber;
    if (this.props.gamePhase === 4) {
      phaseNumber = 1
    } else {
      phaseNumber = this.props.gamePhase + 1
    }
    // await this.clearReady();
    await updateGamePhase(phaseNumber);
    this.sendGamePhase(phaseNumber);
    await updateGameTimer(time);
    await updateGameTimerStart(time);
    if (this.props.gamePhase === 4) {
      console.log('this.props.gamePhase is', this.props.gamePhase, 'calling addTotalScore')
      await this.addTotalScore()
      this.nextQAPlayingList();
    } else if (this.props.gamePhase === 3) {
      console.log('this.props.gamePhase is', this.props.gamePhase, 'calling addRoundScore')
      await this.addRoundScore(0, 0)
    }
    this.countDown();
  };
  endGame = () => {
    const { updateGameEnd } = this.props;
    updateGameEnd(true);
  };
  render() {
    const {
      gameStart,
      gameEnd,
      gamePhase,
      gameTimer,
      rndCurrent
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
        <h2>Players can now join (by phone only)</h2>
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
          <>{gameOver}
            <HScore gamePhase={gamePhase} userList={this.state.userList} />
          </>
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
