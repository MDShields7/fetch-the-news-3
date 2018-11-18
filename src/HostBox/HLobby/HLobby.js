import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import { updateUserList, updateRndCurrent, updateNewsPlayingList, updateQAPlayingList,updateQAPlayingCurrent, updateNewsPlayedList, updateGameStart, updateGamePhase, updateGameTimer } from '../../ducks/reducer';
import { withRouter } from 'react-router';
import HGame from './HGame';
import HScore from './HScore';
import HQA from './HQA';

class HParty extends Component {
  constructor (props){
    super (props)
    this.state = {
      playerArr: [
        {id: 0, name: 'Jose', isReady: false},
        {id: 1, name: 'Nathan', isReady:true},
        {id: 2, name: 'Emilia', isReady: true},
        {id: 3, name: 'Francois', isReady: false},
        {id: 4, name: 'Xixi', isReady: true},
        {id: 5, name: 'Jay', isReady: true},
        {id: 6, name: 'Bill', isReady: true},
        {id: 7, name: 'Juan', isReady: false},
      ]
    }
    
  }
  getTriviaQA = () => {
    axios.get('/api/TrivQASet', {params:{catId:this.props.newsPlayingList.cat_id}})
    .then(res => {
      // console.log('HLobby, getTriviaQA, res.data', res.data)
      this.props.updateQAPlayingList(res.data)})
      .catch(err => {
        console.log('HLobby, getTriviaQA, error', err)
      })
  }
  nextQAPlayingList (arr){
    const {qaPlayingCurrent, qaPlayingList, updateQAPlayingList, updateQAPlayingCurrent} = this.props;
    if (!qaPlayingCurrent['qa_id']){
      console.log('HLobby, qaPlayingList', qaPlayingList)
      console.log('HLobby, qaPlayingCurrent', qaPlayingCurrent)
      let qaPlayingListCopy = qaPlayingList.slice();
      let item = qaPlayingListCopy.shift();
      updateQAPlayingCurrent(item)
      updateQAPlayingList(qaPlayingListCopy);
      console.log('HLobby, qaPlayingList after', qaPlayingList)
      console.log('HLobby, qaPlayingCurrent after', qaPlayingCurrent)
    }
  }
  countDown = (funcAfterTimer) => {
    this.props.gameTimer === 0 ?
    funcAfterTimer()
    :
    setTimeout(funcAfterTimer, 1000);
    this.props.updateGameTimer(this.props.gameTimer-1)
  }


  startGame = () => {
    const { newsPlayingList, updateNewsPlayedList, updateGameStart, updateGamePhase, updateRndCurrent, updateGameTimer} = this.props;
    let listId = newsPlayingList.id;
    console.log('id', listId);
    updateNewsPlayedList(newsPlayingList.cat_name.slice())
    // add score attributes, equal to zero
    // updateUserList
    // start equals true
    updateGameStart(true)
    // phase equals 1
    updateGamePhase(1)
    // round equals 1
    updateRndCurrent(1)
    this.getTriviaQA();
    updateGameTimer(10);
    console.log('HLobby, gamTimer is', this.props.gameTimer)
    this.countDown(this.changePhase)
  }
  changePhase = () => {
    const { updateGamePhase, gamePhase } = this.props;
    if (gamePhase === 1) {
      updateGamePhase(2)
      updateGameTimer(3) 
      this.countDown(this.changePhase)
    } else if (gamePhase === 2) {
      updateGamePhase(3)
      updateGameTimer(3)
      this.countDown(this.changePhase)
    } else if (gamePhase === 3) {
      updateGamePhase(4)
      updateGameTimer(3)
      this.countDown(this.changePhase)
    } else {
    this.changeRound()
    }
    // if phase equals 2
    // show answer highlighted
    // if phase equals 3
    // check answer, add points to roundScore, clear answer
    // if phase equals 3
    // add roundScore to Total Score, clear roundScore
    // updateUserList
    // add 1 to games phase, 2: total score before, 3: total score after
    // updateGamePhase
  }
  changeRound = () => {
    const { gamePhase, rndCurrent, rndLimit, updateGamePhase, updateRndCurrent} = this.props;
    // updateRndCurrent
    let nextRound = rndCurrent +1
    if (nextRound < rndLimit) {
      updateRndCurrent(nextRound)
    }
    updateGamePhase(1)
  }

  render() {
    const {playerArr} = this.state;
    const {gameStart, gamePhase, rndCurrent, rndLimit, updateUserList, updateRndCurrent,updateGameStart, updateGamePhase} = this.props;
    // console.log(gameStart)
    const topArr = playerArr.map(elem => {
      if (elem['id'] % 2 === 0){
        return (
        <div className='player-box'>
        <div className={elem.isReady ? 'player-text-r': 'player-text'}>{elem.name}
        </div>
      </div>)
      }
    })
    const botArr = playerArr.map(elem => {
      if (elem['id'] % 2 !== 0){
        return (
        <div className='player-box'>
        <div className={elem.isReady ? 'player-text-r': 'player-text'}>{elem.name}
        </div>
      </div>)
      }
    })

    const Lobby = (
    <div className='lobby'>
      <div className='list'>Category: {this.props.newsPlayingList.cat_name}</div>
      <div className='roundNum'>{this.props.rndLimit} rounds</div>
      <button className='start-game' onClick={this.startGame}>Start</button>
      <div className={ gameStart ? 'lobby-footer-2' : 'lobby-footer'}>
      { gameStart === false ?
      <>
        <div className='lobby-player-arr'>
            {topArr}
        </div>
        <div className='lobby-player-arr'>
            {botArr}
        </div>
      </>
      :
      <></>
      }
      </div>
    </div>)
    console.log('HLobby, state', this.state)
    console.log('HLobby, props', this.props)
    return (
      <div>
      { !gameStart ?
      <></>
      : <span>{this.props.gameTimer}</span> }
      { !gameStart ?
      Lobby
      : gameStart && gamePhase === 1 || gamePhase === 1 ?
      <>
        <HQA/>
        <HGame/>
      </>
      : <HScore/>
      }
      </div>
    )
  }
}
function mapStateToProps( state ){
  const { id, userList, newsMyList, newsPlayingList, qaPlayingList, qaPlayingCurrent, newsPlayedList, rndLimit, rndCurrent, gameStart, gamePhase, gameTimer} = state;
  return {
    id,
    userList,
    // userScoreList,
    newsMyList,
    newsPlayingList,
    qaPlayingList,
    qaPlayingCurrent, 
    newsPlayedList,
    rndLimit,
    rndCurrent,
    gameStart,
    gamePhase,
    gameTimer
  };
}
export default withRouter(connect (mapStateToProps, { updateUserList, updateRndCurrent, updateNewsPlayingList, updateQAPlayingList, updateQAPlayingCurrent, updateNewsPlayedList, updateGameStart, updateGamePhase, updateGameTimer })(HParty)); 