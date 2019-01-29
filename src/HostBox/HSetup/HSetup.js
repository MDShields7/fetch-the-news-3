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
  componentDidMount = async () => {
    if (this.checkForHost() === true) {
      // let { newsPlayingList, newsMyList } = this.props;
      console.log(this.props.newsMyList)
      if (!this.props.newsPlayingList.hasOwnProperty('id') && !this.props.newsPlayingList['id']) {
        let id = 0;
        // console.log('id', id, 'this.props.newsMyList[id]', this.props.newsMyList[id])
        await this.props.updateNewsPlayingList({
          id: id,
          cat_id: this.props.newsMyList[id].cat_id,
          cat_name: this.props.newsMyList[id].cat_name,
          qa_amount: this.props.newsMyList[id].qa_amount
        })
        // console.log('this.props.newsPlayingList[id]', this.props.newsPlayingList[id])
        if (this.props.rndLimit === null
          || this.props.rndLimit < this.props.newsPlayingList.qa_amount) {
          // console.log('no round limit, this.calcLimit()', this.calcLimit())
          this.props.updateRndLimit(this.calcLimit())
        }
        console.log(id, this.props.newsMyList[id].cat_name)
      }
    }
  }
  componentDidUpdate = (prevProps) => {
    if (this.props.rndLimit !== prevProps.rndLimit) {
      this.setState({ rndLimit: true })
    }
  }
  calcLimit = () => {
    let limit;
    if (this.props.newsPlayingList.qa_amount < 15) {
      limit = this.props.newsPlayingList.qa_amount
    } else {
      limit = 15
    }
    return limit
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
    if (this.props.rndLimit > 1) {
      let newLimit = this.props.rndLimit - 1;
      this.props.updateRndLimit(newLimit);
    }
  }
  rndLimitIncr = () => {
    if (this.props.rndLimit < this.props.newsPlayingList.qa_amount) {
      let newLimit = this.props.rndLimit + 1;
      this.props.updateRndLimit(newLimit);
    }
  }

  newsListDecr = () => {
    if (this.props.newsPlayingList.id > 0) {
      let id = this.props.newsPlayingList.id - 1;
      this.props.updateNewsPlayingList({
        id: id,
        cat_id: this.props.newsMyList[id].cat_id,
        cat_name: this.props.newsMyList[id].cat_name,
        qa_amount: this.props.newsMyList[id].qa_amount
      })
      this.props.updateRndLimit((this.props.newsMyList[id].qa_amount > 15 ? 15 : this.props.newsMyList[id].qa_amount))
    }
  }
  newsListIncr = () => {
    if (this.props.newsPlayingList.id < this.props.newsMyList.length - 1) {
      let id = this.props.newsPlayingList.id + 1;
      this.props.updateNewsPlayingList({
        id: id,
        cat_id: this.props.newsMyList[id].cat_id,
        cat_name: this.props.newsMyList[id].cat_name,
        qa_amount: this.props.newsMyList[id].qa_amount
      })
      this.props.updateRndLimit(this.props.newsMyList[id].qa_amount)
    }
  }

  render() {
    const { host, message } = this.state;
    console.log('HSetup, this.props', this.props)
    return (
      <div className='setup'>
        {host === true ? <>
          <section>
            <h3 className='setup-text'>Choose a News Category</h3>
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
          <h3 className='setup-text'>Choose Number of Rounds</h3>
          <section className='round-limit'>
            <div className='round-limit-center'>
              <div name='round' onClick={this.rndLimitDecr} className='arrow-left' />
              <div className='roundNumBox'>
                <div className='roundNum'>{this.props.rndLimit}</div>
              </div>
              <div onClick={this.rndLimitIncr} className='arrow-right'></div>
            </div>
          </section>
          <h4 >(Only {this.props.newsPlayingList.qa_amount} question{this.props.newsPlayingList.qa_amount && this.props.newsPlayingList.qa_amount.length > 1 ? 's' : ''} available in this category)</h4>
          <NavLink to="/lobby"><button className='start-game'>Create Game</button></NavLink>
        </> : <h3>{message}</h3>}
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