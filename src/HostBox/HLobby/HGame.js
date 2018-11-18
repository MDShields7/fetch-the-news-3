import React, { Component } from 'react';
import {connect} from 'react-redux';
import { updateUserList } from '../../ducks/reducer';
import { withRouter } from 'react-router';

class HGame extends Component {
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
  makeTimerArr = () => {
    let timerArr =[];
    console.log('HGame, gameTimer', this.props.gameTimer)
    for (let i = this.props.gameTimer; i > 0; i--){
      timerArr.push(i);
    }
    console.log('HGame, timerArr', timerArr)
    return timerArr;
  }
  render() {
    const {playerArr} = this.state;
  //   const gameArr = playerArr.map(elem => {
  //     return (
  //     <div className='player-box-sml'>
  //       <div className='player-text-sml'>{elem.name}
  //       </div>
  //     </div>)
  // })
  const topArr = playerArr.map(elem => {
    if (elem['id'] % 2 === 0){
      return (
      <div className='player-box-sml'>
      <div className={elem.isReady ? 'player-text-r': 'player-text-sml'}>{elem.name}
      </div>
    </div>)
    }
  })
  const botArr = playerArr.map(elem => {
    if (elem['id'] % 2 !== 0){
      return (
      <div className='player-box'>
      <div className={elem.isReady ? 'player-text-r': 'player-text-sml'}>{elem.name}
      </div>
    </div>)
    }
  })
  const timerBar = (this.makeTimerArr()).map(elem => {
    return (
      <div className='timerBar'>
        { elem === 1 ?
          <div className='timerAnimate'></div>
        : <div className='timerAnimateNot'></div> }
      </div>
    )
  });
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
  const { userList, rndLimit, rndCurrent, gameStart, gamePhase, gameTimer} = state;
  return {
    userList,
    rndLimit,
    rndCurrent,
    gameStart,
    gamePhase,
    gameTimer
  };
}
export default withRouter(connect (mapStateToProps, { updateUserList})(HGame)); 