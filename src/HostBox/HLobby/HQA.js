import React, { Component } from 'react';
import {connect} from 'react-redux';
// import { updateAnswerList } from '../../ducks/reducer';
import { withRouter } from 'react-router';

class HQA extends Component {
  
  render() {
    const {qaPlayingCurrent, gamePhase} = this.props;
    const {ansRandom} = this.props.qaPlayingCurrent.list;
    const {ansKeyRandom} = this.props.qaPlayingCurrent.list;

    // console.log(ansRandom ? ('ansRandom is ', ansRandom): 'nothing')
    let ACard = ansRandom[3] ?
      ansRandom.map( elem => {
        // console.log('elem is ', elem)
        return(
          <div className='A-Card-1'>
          <div className='A-Card-text'>
          {elem}
          </div>
          </div>
        )
      }) 
    : <div></div>;
    let ACardAnswer = ansRandom[3] ?
    ansRandom.map( elem => {
      let index = ansRandom.indexOf(elem)
      // console.log('ansKeyRandom[index] is ', ansKeyRandom[index])
      return(
        <div className={ansKeyRandom[index] ? 'A-Card-true' : 'A-Card-false'}>
        <div className='A-Card-text'>
        {elem}
        </div>
        </div>
      )
    }) 
  : <div></div>;
    // console.log('ACard', ACard)
    return (
      <div className='HQA-Box'>
        <div className='Q-Box'>
          <div className='Q-text'>{qaPlayingCurrent.question}</div>
            <div className='A-Box'>
              { gamePhase === 1 ?
              ACard
              : gamePhase === 2 ?
              ACardAnswer
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
  const { id, userList, gamePhase, qaPlayingList, qaPlayingCurrent, newsPlayedList } = state;
  return {
    id,
    userList,
    gamePhase,
    qaPlayingList,
    qaPlayingCurrent, 
    newsPlayedList,
  };
}
export default withRouter(connect (mapStateToProps, {  })(HQA)); 