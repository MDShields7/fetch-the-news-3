import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import { updateRndCurrent, updateNewsPlayingList, updateQAPlayingList,updateQAPlayingCurrent, updateNewsPlayedList, updateGameStart, updateGamePhase, updateGameTimer, updateGameTimerStart } from '../../ducks/reducer';
import { withRouter } from 'react-router';
import HGameTimer from './HGameTimer';
import HScore from './HScore';
import HLobbyArr from './HLobbyArr';
import HQA from './HQA';

class HParty extends Component {
  constructor (props){
    super (props)
    this.state = {
      // gameTimerState: null,
      // timerSet: true,
      userList: []
    }
    this.countDown =this.countDown.bind(this)
    const {socket} = props
    socket.on('welcome', (welcome) => {
      console.log('HostBox, receiving welcome', welcome);
      // this.props.updateUser(welcome.user)
      // this.props.updateUserList(welcome.userList)
      this.setState({
        userList: welcome.userList
      })
    })
    socket.on('name welcome', (userJoin) => {
      console.log('HostBox.js, receiving name welcome', userJoin);
      // this.props.updateUser(userJoin.user)
      // this.props.updateUserList(userJoin.userList)
    })
    socket.on('user joined', (message) => {
      console.log('HostBox.js, receiving user join message', message.userList);
      // this.props.updateUserList(message.userList)
      this.setState({
        userList: message.userList
      })
    })
    socket.on('user readied', (message) => {
      console.log('HLobby.js, receiving user ready message', message)
      this.setState({
        userList: message.userList
      })
    })
    socket.on('ready cleared on players', (message) => {
      console.log('HLobby.js, receiving ready cleared on players message', message)
      this.setState({
        userList: message.userList
      })
    })
  }

  // gameStartSocket = () => {
  //   let newUserList = userList.map( elem => {
  //     Object.assign(elem,{roundScore:0, totalScore:0})
  //   })
  //   socket.emit('start package',{

  //   })
  // }
  getTriviaQA = async () => {
    const {newsPlayingList} =this.props;
    await axios.get('/api/TrivQASet', {params:{catId:this.props.newsPlayingList.cat_id}})
    .then(res => {
      console.log('getTriviaQA',res.data)
      this.props.updateQAPlayingList( res.data )})
    .catch(err => {
      console.log('HLobby, getTriviaQA, error', err)})
      this.nextQAPlayingList();
  }
  nextQAPlayingList = () => {
    console.log('----------------------------')
    const {qaPlayingCurrent, qaPlayingList, updateQAPlayingList, updateQAPlayingCurrent} = this.props;
    if (qaPlayingCurrent.length === 0){
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
      console.log('HLobby, nextQAPlayingList function', qaPlayingList)
      // console.log('HLobby, qaPlayingCurre÷nt', qaPlayingCurrent)
      let item = qaPlayingList.shift();
      item = this.reorderQA(item);
      updateQAPlayingCurrent(item);
      updateQAPlayingList(qaPlayingList);
    }
  }
  realScramble = (arr1, arr2, arr3, arr4) => {
    let randomNum = Math.floor(Math.random() * arr1.length)
    let item = arr1.splice(randomNum,1);
    let itemKey = arr2.splice(randomNum,1);
    arr3.push(item[0])
    arr4.push(itemKey[0])
    if (!arr1[0]){
      let answers = Object.assign(
        {ansRandom:arr3, ansKeyRandom:arr4},{})
      console.log('HLobby, scrambleFn result is', answers)
      return answers
    }
    return this.realScramble(arr1, arr2, arr3, arr4)
  }
  scrambleFn = (list) => {
    let answerList = list.slice();
    let answerKeyList = [ true, false, false, false ]
    let ansRandom = [];
    let ansKeyRandom = [];
    return this.realScramble(answerList, answerKeyList, ansRandom, ansKeyRandom)
  }
  reorderQA = (item) => {
    // console.log('item', item)
    let newItem = {};
    let ansArr = [];
    ansArr.push(item.qa_ans1)
    ansArr.push(item.qa_ans2)
    ansArr.push(item.qa_ans3)
    ansArr.push(item.qa_ans4)
    newItem = {
      id: item.qa_id,
      question: item.qa_question,
      list: this.scrambleFn(ansArr)
    }
    return newItem;
  }

  countDown () {
    const { rndCurrent, gamePhase, gameTimer, gameTimerStart} = this.props;
    // console.log('Countdown firing up, gameTimer:', gameTimer)
    if ( gameTimer < 0 ) {
      // console.log('Countdown starting, gameTimer < 0')
      this.props.updateGameTimer(null)
    } else if ( gameTimer === 0 ) {
      // console.log('Countdown starting, gameTimer === 0')
      this.changePhase()
    } else {
      // console.log('Countdown starting, else condition')
      this.props.updateGameTimer( gameTimer-1 )
      setTimeout( () => this.countDown(), 1000)
    }
  }
  clearScores = () => {
    const {userList} = this.props;
    let userListCopy = userList.slice();
    for ( let i = userListCopy.length-1; i >= 0; i--){
      userListCopy[i].totalScore = 0;
      userListCopy[i].roundScore = 0;
    }
  }
  clearReady = () => {
    this.props.socket.emit('clear ready on players', {clearReady: 'yes please'
    })
  }
  sendGamePhase = (phase) => {
    console.log('sending game phase to user --------', phase)
    this.props.socket.emit('game phase', {
      gamePhase: phase
    })
  }
  addScores = () => {
    const {userList} = this.state;
    console.log('HLobby, userList before addScore', userList)
    let userListCopy = [...userList];
    for ( let i = userListCopy.length-1; i >= 0; i--){
      userListCopy[i].totalScore += userListCopy[i].roundScore;
      userListCopy[i].roundScore = 0;
    }
    let newList =[];
    this.playerSortTotal(userListCopy)
    console.log(this.playerSortTotal(userListCopy))
    newList = userListCopy
    console.log('HLobby, userListCopy after addScore, before playerSortTotal', userListCopy)
    console.log('HLobby, newList after playerSortTotal', newList)
    // this.props.updateUserList(newList)
  }
  playerSortTotal = (arr) => {
    let newArr = arr.sort( (a,b) => { return b.totalScore-a.totalScore})
    console.log('playersorttotal', newArr)
    // this.props.updateUserList(newArr)
  }
  changePhase = async() => {
    const { updateGamePhase, gamePhase, updateGameTimer, updateGameTimerStart } = this.props;
    console.log(`changing phase from ${gamePhase} to ${gamePhase+1}`)
    if (gamePhase === 1) {
      let time = 20;
      await this.clearReady()
      updateGamePhase(2)
      this.sendGamePhase(2)
      updateGameTimer(time) 
      await updateGameTimerStart(time) 
      this.countDown()
    } else if (gamePhase === 2) {
      let time = 3;
      await this.clearReady()
      updateGamePhase(3)
      this.sendGamePhase(3)
      updateGameTimer(time) 
      updateGameTimerStart(time) 
      await this.countDown()
    } else if (gamePhase === 3) {
      let time = 3;
      await this.clearReady()
      this.addScores();
      updateGamePhase(4)
      this.sendGamePhase(4)
      updateGameTimer(time) 
      await updateGameTimerStart(time) 
      this.countDown()
    } else {
      this.changeRound()
    }
  }
  startGame = async () => {
    // console.log('HLobby, startGame hit')
    const { newsPlayingList, updateNewsPlayedList, updateGameStart, updateGamePhase, updateRndCurrent, updateGameTimer, updateGameTimerStart} = this.props;
    // let listId = newsPlayingList.id;
    let time = 10;
    this.getTriviaQA()
    this.clearReady()
    updateNewsPlayedList(newsPlayingList.cat_name.slice())
    updateGameStart(true)
    this.sendGamePhase(1)
    updateGamePhase(1)
    updateRndCurrent(1)
    updateGameTimer(time);
    await updateGameTimerStart(time);

    this.countDown()
    console.log('HLobby, gameTimer is', this.props.gameTimer)
  }
  changeRound = () => {
    const { gamePhase, rndCurrent, rndLimit, updateGamePhase, updateRndCurrent} = this.props;

    let nextRound = rndCurrent +1
    if (nextRound < rndLimit) {
      console.log(`changing round from ${rndCurrent} to ${rndCurrent+1}`)
      updateRndCurrent(nextRound)
    }
    updateGamePhase(1)
    this.nextQAPlayingList()
  }

  render() {
    const { socket, gameStart, gamePhase, gameTimer, rndCurrent, rndLimit, updateRndCurrent,updateGameStart, updateGamePhase} = this.props;
    console.log('gameStart:',gameStart,'gamePhase:',gamePhase,'gameTimer:',gameTimer)
    console.log('HLobby, state', this.state)
    console.log('HLobby, props', this.props)
    const {userList} = this.state;
    // console.log(gameStart)

    // const topArr = userList.map(elem => {
    //   console.log('elem si', elem)
    //   if (elem === 0 || elem % 2 === 0){
    //     return (
    //     <div className='player-box'>
    //     <div className={elem.isReady ? 'player-text-r': 'player-text'}>{elem.userName}</div>
    //     <div>{elem}</div>
    //   </div>)
    //   }
    // })
    const Lobby = (
    <div className='lobby'>
      <div className='list'>Category: {this.props.newsPlayingList.cat_name}</div>
      <div className='roundNum'>{this.props.rndLimit} rounds</div>
      <button className='start-game' onClick={this.startGame}>Start</button>
      
      

    </div>)
    const Users = (
      <div className={!gameStart ? 'lobby-footer': 'lobby-footer-sml'}>
        <div className='lobby-player-arr'>
          {userList ? userList.map(elem => {
            return (
              <div className={!gameStart ? 'player-box' : 'player-box-sml' }>
                <div className={elem.isReady ? 'player-text-r': 'player-text'}>{elem.userName}</div>
            </div>)
          })
          :
          <></>}
        </div>
      </div>)
    return (
      <div>
        { !gameStart ? <>
        {Lobby}
        {Users}
        {/* <HLobbyArr userList={this.state.userList} socket={this.props.socket}/> */}
        </>
        : gamePhase === 1 ?
        <>
          <HQA/>
          <HGameTimer userList={this.state.userList}/>
          {Users}
          {/* <HLobbyArr userList={this.state.userList} socket={this.props.socket}/> */}
        </>
        : gamePhase === 2 ? <>
        <HQA/>
        {Users} </>
        : <HScore />
        }
      </div>
    )
  }
}
function mapStateToProps( state ){
  const { id, newsMyList, newsPlayingList, qaPlayingList, qaPlayingCurrent, newsPlayedList, rndLimit, rndCurrent, gameStart, gamePhase, gameTimer, gameTimerStart} = state;
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
    gamePhase,
    gameTimer,
    gameTimerStart
  };
}
export default withRouter(connect (mapStateToProps, { updateRndCurrent, updateNewsPlayingList, updateQAPlayingList, updateQAPlayingCurrent, updateNewsPlayedList, updateGameStart, updateGamePhase, updateGameTimer, updateGameTimerStart })(HParty)); 