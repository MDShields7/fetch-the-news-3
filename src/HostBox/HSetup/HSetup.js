import React, { Component } from 'react'
import {connect} from 'react-redux';
// import { updateRndLimit } from '../../ducks/reducer';
import { updateRndLimit, updateNewsPlayingList } from '../../ducks/reducer';
import { withRouter } from 'react-router';

class HSetup extends Component {
  constructor (){
    super();
  }
  // set newsPlaying list {id: ???, list: ???} upon page load
  rndLimitDecr = () => {
    if (this.props.rndLimit > 3 ){
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
  newsListIncr(){
    console.log('new Playing List, before id & list:', this.props.newsPlayingList[id] , this.props.newsPlayingList)
    if (this.props.newsPlayingList[id] < this.props.newsMyList.length){
      let newId = this.props.newsPlayingList[id] + 1;
      console.log('new Playing List, after id & list:', newId , newsMyList[newId])
      this.props.updateNewsPlayingList({id:newId, list: newsMyList[newId]})
    }
  }

  // rndLimitIncr = (e) => {
  //   let list = [];
  //   let max = null;
  //   let target = null;
  //   let func =null;
  //   // let funcpart2 = null;
  //   if (e.target.name === 'round'){
  //     list = this.props.rndLimit;
  //     max = 15;
  //     target = this.props.rndLimit;
  //     func = this.props.updateRndLimit;
  //   } else {
  //     list = this.props.newsMyList;
  //     max = this.props.newsMyList.length;
  //     target = this.props.newsPlayingList;
  //     func = this.props.updateNewsPlayingList;
  //     // funcpart2 = this.props.newsMyList
  //   }
  //   if (target < max ){
  //     let newLimit = target + 1;
  //     func(this.props.newsMyList(newLimit));
  //   }
  // }
  render() {

    return (
      <div className='setup'>
        {/* <h1>Host Setup</h1> */}
        <section>
          <div className='setup-text'>Choose a News Category</div>
          <div className='news-cat'>
            <div className='news-cat'></div>
              <div></div>
          </div>

        </section>
        <div className='setup-text'>Choose Number of Rounds</div>
        <section className='round-limit'>
          <div className='round-limit-center'>
          <img name='round' onClick={this.limitDecr} className='arrow-left'/>
          <div className='roundNum'>{this.props.rndLimit}</div>
          <div onClick={this.limitIncr} className='arrow-right'></div>
          </div>
        </section>
        <button className='start-game'>Start Game</button>
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
export default withRouter(connect (mapStateToProps, { updateRndLimit, updateNewsPlayingList })(HSetup)); 