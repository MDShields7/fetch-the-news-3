import React, { Component } from 'react';
import {connect} from 'react-redux';
import { updateRndCurrent, updateNewsPlayingList  } from '../../ducks/reducer';
import { withRouter } from 'react-router';

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

  render() {
    const {playerArr} = this.state;

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

    return (
      <div className='lobby'>
        <div className='list'>Category: {this.props.newsPlayingList.list}</div>

        <div className='roundNum'>{this.props.rndLimit} rounds</div>

        <div className='lobby-footer'>
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
  const {newsMyList, newsPlayingList, rndLimit} = state;
  return {
    newsMyList,
    newsPlayingList,
    rndLimit
  };
}
export default withRouter(connect (mapStateToProps, { updateRndCurrent, updateNewsPlayingList })(HParty)); 