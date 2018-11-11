import React, { Component } from 'react'
import {connect} from 'react-redux';
// import { updateRndLimit } from '../../ducks/reducer';
import { updateRndLimit, updateNewsPlayingList } from '../../ducks/reducer';
import { withRouter } from 'react-router';



class HSetup extends Component {
  constructor (){
    super();
  }
  rndLimitDecr = () => {
    if (this.props.rndLimit > 1 ){
      let newLimit = this.props.rndLimit - 1;
      this.props.updateRndLimit(newLimit);
    }
  }
  rndLimitIncr = () => {
    if (this.props.rndLimit < 15 ){
      let newLimit = this.props.rndLimit + 1;
      this.props.updateRndLimit(newLimit);
    }
  }
  render() {
    return (
      <div>
        <h1>Host Setup</h1>
        <section>
          <div>Choose a News Category</div>


        </section>
        <section>
          <div>Choose Number of Rounds</div>
          <img onClick={this.rndLimitDecr} className='arrow-left' src="http://chittagongit.com//images/arrow-icon-black/arrow-icon-black-23.jpg" alt=""/>
          <div>{this.props.rndLimit}</div>
          <img onClick={this.rndLimitIncr} className='arrow-right'  src="http://chittagongit.com//images/arrow-icon-black/arrow-icon-black-23.jpg" alt=""/>
        </section>
        <button></button>
      </div>
    )
  }
}
function mapStateToProps( state ){
  const {newsMyList, rndLimit} = state;
  return {
    newsMyList,
    rndLimit
  };
}
export default withRouter(connect (mapStateToProps, { updateRndLimit, updateNewsPlayingList })(HSetup)); 