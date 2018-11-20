import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import { updateUserList, updateRndCurrent, updateNewsPlayingList, updateQAPlayingList,updateQAPlayingCurrent, updateNewsPlayedList, updateGameStart, updateGamePhase, updateGameTimer, updateGameTimerStart } from '../../ducks/reducer';
import { withRouter } from 'react-router';
import HGame from './HGame';
import HScore from './HScore';
import HQA from './HQA';

class HParty extends Component {
  constructor (props){
    super (props)
    this.state = {
      // gameTimerState: null,
      timerSet: true,
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
    this.countDown =this.countDown.bind(this)
  }
  componentDidUpdate(prevProps){
    // if ( this.props.gameTimer !== prevProps.gameTimer && this.state.timerSet === true){
    //   console.log('componentDidUpdate, setting gameTimer', this.props.gameTimer)
    //   this.countDown();
    // }
  }
  // callCountDown = () => {
  //   console.log('1223456778890')
  //   this.countDown()
  // }
  getTriviaQA = () => {
    const {newsPlayingList} =this.props;
    axios.get('/api/TrivQASet', {params:{catId:this.props.newsPlayingList.cat_id}})
    .then(res => {
      console.log('HLobby, getTriviaQA, res.data', res.data)
      this.props.updateQAPlayingList( res.data )
    })
    .catch(err => {
      console.log('HLobby, getTriviaQA, error', err)
    })
  }
  nextQAPlayingList = () => {
    console.log('----------------------------')
    const {qaPlayingCurrent, qaPlayingList, updateQAPlayingList, updateQAPlayingCurrent} = this.props;
    if (qaPlayingCurrent === []){
      console.log('HLobby, qaPlayingList', qaPlayingList)
      console.log('HLobby, qaPlayingCurrent', qaPlayingCurrent)
      let qaPlayingListCopy = qaPlayingList.slice();
      let item = qaPlayingListCopy.shift();
      item = this.reorderQA(item);
      updateQAPlayingCurrent(item);
      updateQAPlayingList(qaPlayingListCopy);
      console.log('HLobby, qaPlayingList after', qaPlayingList)
      console.log('HLobby, qaPlayingCurrent after', qaPlayingCurrent)
    } else {
      let item = qaPlayingList.shift();
      // console.log('qaPlaying List current ----------------------', item);
      item = this.reorderQA(item);
      // console.log('qaPlaying List current ----------------------', item);
      updateQAPlayingCurrent(item);
      updateQAPlayingList(qaPlayingList);
    }
  }
  reorderQA = (item) => {
    let newItem = {};
    let ansArr = [];
    ansArr.push(item.qa_ans1)
    ansArr.push(item.qa_ans2)
    ansArr.push(item.qa_ans3)
    ansArr.push(item.qa_ans4)
    newItem = {
      id: item.qa_id,
      question: item.qa_question,
      list: ansArr
    }
    return newItem;
  }
  countDown () {
    const { rndCurrent, gamePhase, gameTimer, gameTimerStart} = this.props;
    // console.log('HLobby, rndCurrent', rndCurrent, 'gamePhase:',gamePhase,'gameTimer:', gameTimer, 'gameTimerStart:', gameTimerStart )
    if ( this.props.gameTimer < 0 ) {
      this.props.updateGameTimer(null)
    } else if ( this.props.gameTimer === 0 ) {
      this.changePhase()
    } else {
      this.props.updateGameTimer(this.props.gameTimer-1)
      setTimeout( () => this.countDown(), 1000)
    }

  }
  startGame = () => {
    const { newsPlayingList, updateNewsPlayedList, updateGameStart, updateGamePhase, updateRndCurrent, updateGameTimer, updateGameTimerStart} = this.props;
    let listId = newsPlayingList.id;
    let time = 10;
    // console.log('id', listId);
    this.getTriviaQA();
    updateNewsPlayedList(newsPlayingList.cat_name.slice())
    // add score attributes, equal to zero
    // updateUserList
    // start equals true
    updateGameStart(true)
    // phase equals 1
    updateGamePhase(1)
    // round equals 1
    updateRndCurrent(1)
    updateGameTimer(time);
    updateGameTimerStart(time);
    setTimeout(() => 
    {
      console.log('gameTimer is', this.props.gameTimer)
      this.nextQAPlayingList();
      this.countDown()
    }, 1000)
    console.log('HLobby, gameTimer is', this.props.gameTimer)
    // if (this.props.gameTimer === time){
    // }
  }
  changePhase = () => {
    const { updateGamePhase, gamePhase, updateGameTimer, updateGameTimerStart } = this.props;
    console.log(`changing phase from ${gamePhase} to ${gamePhase+1}`)
    if (gamePhase === 1) {
      let time = 3;
      updateGamePhase(2)
      updateGameTimer(time) 
      updateGameTimerStart(time) 
      setTimeout(() => 
      {
        console.log('gameTimer is', this.props.gameTimer)
        this.countDown()
      }, 1000)
    } else if (gamePhase === 2) {
      let time = 3;
      updateGamePhase(3)
      updateGameTimer(time) 
      updateGameTimerStart(time) 
      setTimeout(() => 
      {
        console.log('gameTimer is', this.props.gameTimer)
        this.countDown()
      }, 1000)
    } else if (gamePhase === 3) {
      let time = 3;
      updateGamePhase(4)
      updateGameTimer(time) 
      updateGameTimerStart(time) 
      setTimeout(() => 
      {
        console.log('gameTimer is', this.props.gameTimer)
        this.countDown()
      }, 1000)
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
      console.log(`changing round from ${rndCurrent} to ${rndCurrent+1}`)
      updateRndCurrent(nextRound)
    }
    updateGamePhase(1)
    this.nextQAPlayingList()
  }

  render() {
    console.log('HLobby, props', this.props)
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
    // console.log('HLobby, state', this.state)
    // console.log('HLobby, props', this.props)
    return (
      <div>
      { !gameStart ?
      <></>
      : <span>{this.props.gameTimer}</span> }
      { !gameStart ?
      Lobby
      : gamePhase === 1 ?
      <>
        <HQA/>
        <HGame/>
      </>
      : gamePhase === 2 ?
      <HQA/>
      : <HScore/>
      }
      </div>
    )
  }
}
function mapStateToProps( state ){
  const { id, userList, newsMyList, newsPlayingList, qaPlayingList, qaPlayingCurrent, newsPlayedList, rndLimit, rndCurrent, gameStart, gamePhase, gameTimer, gameTimerStart} = state;
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
    gameTimer,
    gameTimerStart
  };
}
export default withRouter(connect (mapStateToProps, { updateUserList, updateRndCurrent, updateNewsPlayingList, updateQAPlayingList, updateQAPlayingCurrent, updateNewsPlayedList, updateGameStart, updateGamePhase, updateGameTimer, updateGameTimerStart })(HParty)); 