import React, { Component } from 'react';
import {connect} from 'react-redux';
// import { updateGameTimerStart } from '../../ducks/reducer';
import { withRouter } from 'react-router';

class HQA extends Component {
  render() {
    const {qaPlayingCurrent} = this.props
    const {list} = this.props.qaPlayingCurrent
    console.log('list is ', list)
    let ACard = list ?
      list.map( elem => {
        console.log('elem is ', elem)
        return(
          <div className='A-Card'>{elem}</div>
        )
      }) 
    : <div></div>;
    console.log('ACrad', ACard)
    return (
      <div className='HQA-Box'>
        <div className='Q-Box'>
          <div className='Q-text'>{qaPlayingCurrent.question}</div>
            <div className='A-Box'>
              { this.props.qaPlayingCurrent.list ?
              ACard
              : 
              <div></div>
              }
            </div>
          </div>
        </div>
    )
  }
}
function mapStateToProps( state ){
  const { id, userList, qaPlayingList, qaPlayingCurrent, newsPlayedList } = state;
  return {
    id,
    userList,
    qaPlayingList,
    qaPlayingCurrent, 
    newsPlayedList,
  };
}
export default withRouter(connect (mapStateToProps)(HQA)); 