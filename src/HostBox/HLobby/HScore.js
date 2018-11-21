import React, { Component } from 'react';
import {connect} from 'react-redux';
import { updateUserList, updateRndCurrent, updateNewsPlayingList, updateQAPlayingList,updateQAPlayingCurrent, updateNewsPlayedList, updateGameStart, updateGamePhase, updateGameTimer, updateGameTimerStart } from '../../ducks/reducer';
import { withRouter } from 'react-router';

class HScore extends Component {
  constructor (props){
    super (props)
    this.state = {
      // gameTimerState: null,
      timerSet: true,
      playerTotalArr: [],
      playerArr: [
        {id: 0, name: 'Jose', isReady: false, roundScore: 100, totalScore:500},
        {id: 1, name: 'Nathan', isReady:true, roundScore: 0, totalScore:400},
        {id: 2, name: 'Emilia', isReady: true, roundScore: 200, totalScore:100},
        {id: 3, name: 'Francois', isReady: false, roundScore: 0, totalScore:200},
        {id: 4, name: 'Xixi', isReady: true, roundScore: 0, totalScore:300},
        {id: 5, name: 'Jay', isReady: true, roundScore: 100, totalScore:300},
        {id: 6, name: 'Bill', isReady: true, roundScore: 100, totalScore:300},
        {id: 7, name: 'Juan', isReady: false, roundScore: 100, totalScore:400},
      ]
    }
  }
  componentDidUpdate = (prevProps) => {
    // if ( prevProps.userList !== this.props.userList ){
    // }
  }

  render() {
    const {userList} =this.props;
    const totalScores = /*this.props.gamePhase === 3 &&*/ userList ?
    userList.map( elem => {
      return <div className='Player-Card'>
      {console.log('PH3 elem is', elem)}
      <div className='pl-1'>{elem.name}</div>
      <div className='pl-2'>{elem.totalScore}</div>
      </div>
    }) : /*this.props.gamePhase === 4 &&*/ userList ?
    userList.map( elem => {
      return <div className='Player-Card'>
      {console.log('PH4 elem is', elem)}
      <div className='pl-1'>{elem.name}</div>
      <div className='pl-2'>{elem.totalScore}</div>
      </div>
      }) : <div>WHAT ?????</div>
    return (
      <div className='HScore'>
        { userList ?
        totalScores
      : 
        <></>
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
export default withRouter(connect (mapStateToProps, { updateUserList, updateRndCurrent, updateNewsPlayingList, updateQAPlayingList, updateQAPlayingCurrent, updateNewsPlayedList, updateGameStart, updateGamePhase, updateGameTimer, updateGameTimerStart })(HScore)); 