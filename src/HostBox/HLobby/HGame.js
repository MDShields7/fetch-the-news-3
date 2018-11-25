import React, { Component } from 'react';
import {connect} from 'react-redux';
import { updateUserList } from '../../ducks/reducer';
import { withRouter } from 'react-router';

class HGame extends Component {
  constructor (props){
    super (props)
    // this.state = {
      // playerArr: [
      //   {id: 0, name: 'Jose', isReady: false},
      //   {id: 1, name: 'Nathan', isReady:true},
      //   {id: 2, name: 'Emilia', isReady: true},
      //   {id: 3, name: 'Francois', isReady: false},
      //   {id: 4, name: 'Xixi', isReady: true},
      //   {id: 5, name: 'Jay', isReady: true},
      //   {id: 6, name: 'Bill', isReady: true},
      //   {id: 7, name: 'Juan', isReady: false},
      // ]
    // }

  }
  makeTimerArr = () => {
    let timerArr =[];
    const {gameTimer, gameTimerStart} = this.props;
    if (gameTimerStart){
      for (let i = gameTimerStart; i > 0; i--){
        if ( i > gameTimer) {
          // console.log('first condition, i > gameTimer')
          timerArr.push({item:i, timePassed:true})
        } else if ( i === gameTimer) {
          // console.log('2nd condition, i = gameTimer')
          timerArr.push({item:i, timePassed:0})
        } else if ( i < gameTimer) {
          // console.log('3rd condition, i < gameTimer')
          timerArr.push({item:i, timePassed:false})
        }
        // console.log('HGame, timerArr', timerArr)
      }
      return timerArr.reverse();
    } else {
      return timerArr;
    }
  }
  render() {
    const {userList} = this.props;
    console.log('userList', this.props.userList)
  //   const gameArr = playerArr.map(elem => {
  //     return (
  //     <div className='player-box-sml'>
  //       <div className='player-text-sml'>{elem.name}
  //       </div>
  //     </div>)
  // })
  // let timerArr = if (gameTimerStart) {this.makeTimerArr()}
  // console.log('HGame, timerArr in render', timerArr)
  const topArr = userList.map(elem => {
    if (elem['id'] % 2 === 0){
      return (
      <div className='player-box-sml'>
      <div className={elem.isReady ? 'player-text-r': 'player-text-sml'}>{elem.name}
      </div>
    </div>)
    }
  })
  const botArr = userList.map(elem => {
    if (elem['id'] % 2 !== 0){
      return (
      <div className='player-box'>
      <div className={elem.isReady ? 'player-text-r': 'player-text-sml'}>{elem.name}
      </div>
    </div>)
    }
  })
  const timerBar = (this.makeTimerArr().map(elem => {
    return (
      <div className='timerBar'>
        { elem['timePassed'] === false ?
          <div className='timerAnimateSoon'></div>
        : elem['timePassed'] === 0 ?
        <div className='timerAnimate'></div>
        : <div className='timerAnimateAlready'></div>
        }
      </div>
    )
  }))
    return (
      //TIMER 
      <div className='HGame'>
        <div className='lobby-timer'>
          {/* <div>TIMER</div> */}
          {timerBar}
        </div>
        
        <div className='lobby-footer-sml'>
          <div className='lobby-player-arr'>
              {topArr}
          </div>
          <div className='lobby-player-arr'>
              {botArr}
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps( state ){
  const { userList, rndLimit, rndCurrent, gameStart, gamePhase, gameTimer, gameTimerStart} = state;
  return {
    userList,
    rndLimit,
    rndCurrent,
    gameStart,
    gamePhase,
    gameTimer,
    gameTimerStart
  };
}
export default withRouter(connect (mapStateToProps, { updateUserList})(HGame)); 