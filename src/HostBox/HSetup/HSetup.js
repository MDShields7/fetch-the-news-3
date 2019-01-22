import React, { Component } from 'react'
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
// import { updateRndLimit } from '../../ducks/reducer';
import { updateRndLimit, updateNewsPlayingList } from '../../ducks/reducer';
import { withRouter } from 'react-router';

class HSetup extends Component {
  constructor() {
    super();
    this.state = {
      host: false,
      message: '',
    }
  }
  // set newsPlaying list {id: ???, list: ???} upon page load
  componentDidMount = () => {
    if (this.checkForHost() === true) {
      let { newsPlayingList, newsMyList } = this.props;
      console.log(this.props.newsMyList)
      if (!newsPlayingList.hasOwnProperty('id') && !newsPlayingList['id']) {
        newsPlayingList['id'] = 0;
        const { id } = this.props.newsPlayingList
        // console.log('Hsetup----------------',newsMyList)
        this.props.updateNewsPlayingList({
          id: newsPlayingList.id, cat_id: newsMyList[id].cat_id, cat_name: newsMyList[id].cat_name
        })
        console.log(id, newsMyList[id].cat_name)
      }
    }
  }
  checkForHost = () => {
    if (this.props.host === null) {
      this.setState({ message: 'Please login to play' })
      return false
    }
    this.setState({ host: true })
    return true
  }
  rndLimitDecr = () => {
    if (this.props.rndLimit > 3) {
      let newLimit = this.props.rndLimit - 1;
      this.props.updateRndLimit(newLimit);
    }
  }
  rndLimitIncr = () => {
    if (this.props.rndLimit < 15) {
      let newLimit = this.props.rndLimit + 1;
      this.props.updateRndLimit(newLimit);
    }
  }
  newsListDecr = () => {
    if (this.props.newsPlayingList.id > 0) {
      let newId = this.props.newsPlayingList.id - 1;
      this.props.updateNewsPlayingList({ id: newId, cat_id: this.props.newsMyList[newId]['cat_id'], cat_name: this.props.newsMyList[newId]['cat_name'] })
    }
  }
  newsListIncr = () => {
    if (this.props.newsPlayingList.id < this.props.newsMyList.length - 1) {
      let newId = this.props.newsPlayingList.id + 1;
      this.props.updateNewsPlayingList({ id: newId, cat_id: this.props.newsMyList[newId]['cat_id'], cat_name: this.props.newsMyList[newId]['cat_name'] })
    }
  }

  render() {
    const { host, message } = this.state;
    console.log('HSetup, this.props', this.props)
    return (
      <div className='setup'>
        {host === true ? <>
          <section>
            <div className='setup-text'>Choose a News Category</div>
            <section className='round-limit'>
              <div className='round-limit-center'>
                <div name='round' onClick={this.newsListDecr} className='arrow-left' />
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
              <div name='round' onClick={this.rndLimitDecr} className='arrow-left' />
              <div className='roundNumBox'>
                <div className='roundNum'>{this.props.rndLimit}</div>
              </div>
              <div onClick={this.rndLimitIncr} className='arrow-right'></div>
            </div>
          </section>
          <NavLink to="/lobby"><button className='start-game'>Create Game</button></NavLink>
        </> : <div>{message}</div>}
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { host, newsMyList, newsPlayingList, rndLimit } = state;
  return {
    host,
    newsMyList,
    newsPlayingList,
    rndLimit
  };
}
export default withRouter(connect(mapStateToProps, { updateRndLimit, updateNewsPlayingList })(HSetup)); 