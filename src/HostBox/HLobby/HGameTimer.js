import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateUserList } from '../../ducks/reducer';
import { withRouter } from 'react-router';

class HGame extends Component {
  constructor(props) {
    super(props)
  }
  makeTimerArr = () => {
    let timerArr = [];
    const { gameTimer, gameTimerStart } = this.props;
    if (gameTimerStart) {
      for (let i = gameTimerStart; i > 0; i--) {
        if (i > gameTimer) {
          timerArr.push({ item: i, timePassed: true })
        } else if (i === gameTimer) {
          timerArr.push({ item: i, timePassed: 0 })
        } else if (i < gameTimer) {
          timerArr.push({ item: i, timePassed: false })
        }
      }
      return timerArr.reverse();
    } else {
      return timerArr;
    }
  }
  render() {
    const { gameTimerStart } = this.props;
    const botArr = this.props.userList.map(elem => {
      return (
        <div className='player-box-sml' key={elem.uesrId}>
          <div className={elem.isReady ? 'player-text-r' : 'player-text'}>{elem.userName}</div>
        </div>)
    })
    const timerBar = (this.makeTimerArr().map(elem => {
      return (
        <div className='timerBar' key={elem.item}>
          {elem['timePassed'] === false ?
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
          {gameTimerStart ?
            timerBar
            : <></>}
        </div>

        <div className='lobby-footer-sml'>
          <div className='lobby-player-arr'>
            {botArr}
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { userList, rndLimit, rndCurrent, gameStart, gamePhase, gameTimer, gameTimerStart } = state;
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
export default withRouter(connect(mapStateToProps, { updateUserList })(HGame)); 