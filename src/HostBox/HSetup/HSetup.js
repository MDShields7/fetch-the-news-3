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
  componentDidMount = () => {
    let { newsPlayingList, newsMyList } = this.props;
      console.log(this.props.newsMyList)
    if ( !newsPlayingList.hasOwnProperty('id') && !newsPlayingList['id']){
      newsPlayingList['id'] = 0;
      const{id} = this.props.newsPlayingList
      console.log('Hsetup----------------',newsMyList)
      this.props.updateNewsPlayingList({
      id: newsPlayingList.id, cat_id: newsMyList[id].cat_id, cat_name: newsMyList[id].cat_name })
      console.log(id, newsMyList[id].cat_name)
    }
  }
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
  newsListDecr = () => {
    if (this.props.newsPlayingList.id > 0){
      let newId = this.props.newsPlayingList.id - 1;
      this.props.updateNewsPlayingList({id:newId, cat_id: this.props.newsMyList[newId]['cat_id'], cat_name: this.props.newsMyList[newId]['cat_name']})
    }
  }
  newsListIncr = () => {
    if (this.props.newsPlayingList.id < this.props.newsMyList.length - 1){
      let newId = this.props.newsPlayingList.id + 1;
      this.props.updateNewsPlayingList({id:newId, cat_id: this.props.newsMyList[newId]['cat_id'], cat_name: this.props.newsMyList[newId]['cat_name']})
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

    console.log('HSetup, this.props', this.props)
    return (
      <div className='setup'>
        {/* <h1>Host Setup</h1> */}
        <section>
          <div className='setup-text'>Choose a News Category</div>
          <section className='round-limit'>
            <div className='round-limit-center'>
              <div name='round' onClick={this.newsListDecr} className='arrow-left'/>
              <div className='listBox'>
                <div className='list'>{this.props.newsPlayingList.cat_name}</div>
              </div>
              <div onClick={this.newsListIncr} className='arrow-right'></div>
            </div>
          </section>

        </section>
        <div className='setup-text'>Choose Number of Rounds</div>
        <section className='round-limit'>
          <div className='round-limit-center'>
            <div name='round' onClick={this.rndLimitDecr} className='arrow-left'/>
            <div className='roundNumBox'>
              <div className='roundNum'>{this.props.rndLimit}</div>
            </div>
            <div onClick={this.rndLimitIncr} className='arrow-right'></div>
          </div>
        </section>
        <button className='start-game'>Next</button>
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