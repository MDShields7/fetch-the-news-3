import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateUserList, updateRndCurrent, updateNewsPlayingList, updateQAPlayingList, updateQAPlayingCurrent, updateNewsPlayedList, updateGameStart, updateGamePhase, updateGameTimer, updateGameTimerStart } from '../../ducks/reducer';
import { withRouter } from 'react-router';

class HScore extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const { userList, gamePhase } = this.props;
    const totalScores = (
      gamePhase === 3 && userList ?
        (userList.map(elem => {
          return <div className='player-Card'>
            <div className='pl-1'>{elem.userName}</div>
            <div className='pl-2'>{elem.roundScore}</div>
          </div>
        }))
        : gamePhase === 4 && userList ?
          (userList.map(elem => {
            return <div className='player-Card'>
              <div className='pl-1'>{elem.userName}</div>
              <div className='pl-2'>{elem.totalScore}</div>
            </div>
          }))
          : <div>WHAT ?????</div>)
    return (
      <div className='hScore'>
        {gamePhase === 3 ? <h1>SCORES</h1>
          : gamePhase === 4 ? <h1>TOTAL SCORES</h1>
            : <></>}
        {userList ?
          <>{totalScores}</>
          :
          <div>this.props.userList is: {this.props.userList}</div>
        }
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { id, newsMyList, newsPlayingList, qaPlayingList, qaPlayingCurrent, newsPlayedList, rndLimit, rndCurrent, gameStart, gamePhase, gameTimer, gameTimerStart } = state;
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
export default withRouter(connect(mapStateToProps, { updateUserList, updateRndCurrent, updateNewsPlayingList, updateQAPlayingList, updateQAPlayingCurrent, updateNewsPlayedList, updateGameStart, updateGamePhase, updateGameTimer, updateGameTimerStart })(HScore)); 