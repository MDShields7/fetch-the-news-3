import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import { updateUserList, updateRndCurrent, updateNewsPlayingList, updateNewsPlayedList, updateGameStart, updateGamePhase, updateGameTimer } from '../../ducks/reducer';
import { withRouter } from 'react-router';
import HGame from './HGame';

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
  // getTriviaQA = () => {
  //   axios.get('/api/TrivQASet', {params:{userId:2}})
  //   .then(res => {
  //     console.log('HLobby, getTriviaQA, res.data', res.data)
  //     .catch(err => {
  //       console.log('HLobby, getTriviaQA, error', err)
  //     })
  //   })
  // }
  countDown = (func, num) => {
    this.props.gameTimer === 0 ?
    func()
    :
    setTimeout(func, 1000);
    this.props.updateGameTimer(num-1)
  }


  startGame = () => {
    let listId = this.props.newsPlayingList.id;
    console.log('id', listId);
    this.props.updateNewsPlayedList(this.props.newsPlayingList.list.slice())
    // add score attributes, equal to zero
    // updateUserList
    // start equals true
    this.props.updateGameStart(true)
    // phase equals 1
    this.props.updateGamePhase(1)
    // round equals 1
    this.props.updateRndCurrent(1)
    console.log('HLobby, state', this.state)
    console.log('HLobby, props', this.props)
  }
  changePhase = () => {
    // if phase equals 2
    // check answer, add points to roundScore, clear answer
    // if phase equals 3
    // add roundScore to Total Score, clear roundScore
    // updateUserList
    // add 1 to games phase, 2: total score before, 3: total score after
    // updateGamePhase
  }
  changeRound (){
    //
    // updateRndCurrent
  }

  render() {
    const {playerArr} = this.state;
    const {gameStart, gamePhase, rndCurrent, rndLimit, updateUserList, updateRndCurrent,updateGameStart, updateGamePhase} = this.props;
    console.log(gameStart)
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
      <div className='list'>Category: {this.props.newsPlayingList.list}</div>
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
      Lobby
      :
      <HGame/>
      }
      </div>
    )
  }
}
function mapStateToProps( state ){
  const {userList, newsMyList, newsPlayingList, newsPlayedList, rndLimit, rndCurrent, gameStart, gamePhase, gameTimer} = state;
  return {
    userList,
    // userScoreList,
    newsMyList,
    newsPlayingList,
    newsPlayedList,
    rndLimit,
    rndCurrent,
    gameStart,
    gamePhase,
    gameTimer
  };
}
export default withRouter(connect (mapStateToProps, { updateUserList, updateRndCurrent, updateNewsPlayingList, updateNewsPlayedList, updateGameStart, updateGamePhase, updateGameTimer })(HParty)); 