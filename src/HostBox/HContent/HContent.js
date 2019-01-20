import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { updateTrivSwitch, updateNewsAllList, updateNewsMyList, updateNewsMyListCreated } from '../../ducks/reducer';
import { withRouter } from 'react-router';
import HCSet from './HContentSet';

class HContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trivSwitch: 1, // Trivia List buttons on/off assignment
      trivSetName: '',
      trivSetToMap: props.newsAllList,
      userId: this.props.id,
    }
  }
  componentDidMount = () => {
    if (this.props.newsAllList) {
      this.loadButtons()
      this.loadContent();
    }
  }
  componentDidUpdate = (prevProps) => {
    if (this.props.newsMyListCreated !== prevProps.newsMyListCreated) {
      this.loadButtons()
      this.loadContent()
    }
  }
  loadContent = () => {
    this.setState({
      trivSwitch: 1,
      trivSetToMap: this.props.newsAllList
    })
  }
  getAllSets = (num) => {
    // if (num === 0) {
    //   console.log('getting alll sets')
    //   this.getMyTriviaSet();
    //   this.getMyTriviaCreated();
    //   this.getTriviaSet();
    // } else 
    if (num === 1) {
      this.getTriviaSet();
    } else if (num === 2) {
      this.getMyTriviaSet();
    } else if (num === 3) {
      this.getMyTriviaCreated();
    }
  }
  getTriviaSet = () => {
    if (this.state.userId) {
      console.log('getTriviaSet')
      axios.get('/api/TrivSet').then(res => {
        this.props.updateNewsAllList(res.data)
        this.setState({
          trivSwitch: 1,
          trivSetToMap: this.props.newsAllList
        })
        // console.log('HContent, this.props.newAllList', this.props.newsAllList)
      })
        .catch(err => console.log('error at get TriviaSet', err))
    }
  }
  getMyTriviaSet = () => {
    if (this.state.userId) {
      console.log('getMyTriviaSet')
      axios.get('/api/MyTrivSet', { params: { userId: this.state.userId } }).then(res => {
        this.props.updateNewsMyList(res.data)
        // console.log('HContent, this.props.newsMyList', this.props.newsMyList)
      })
        .catch(err => console.log('error at get TriviaSet', err))
    }
  }
  getMyTriviaCreated = () => {
    if (this.state.userId) {
      console.log('getTriviaSetCreated')
      axios.get('/api/MyTrivSetCreated', { params: { userId: this.state.userId } }).then(res => {
        this.props.updateNewsMyListCreated(res.data)
        // console.log('HContent, this.props.newsMyListCreated', this.props.newsMyListCreated)
      })
        .catch(err => console.log('error at get TriviaSet', err))
    }
  }
  createTriviaSet = () => {
    // console.log('createTriviaSet w/ req.body',this.state.trivSetName)
    axios.post('/api/TrivSet', { trivSetName: this.state.trivSetName })
      .then(res => {
        this.createTrivList(res.data[0]['cat_id']);
        this.createTrivCreator(res.data[0]['cat_id']);
      })
      .catch(err => console.log('error at post TriviaSet', err))
    this.getAllSets(this.state.trivSwitch);
  }
  createTrivCreator = (catId) => {
    const { userId } = this.state;
    // console.log('createTrivCreator, userId:', userId,'catId:', catId)
    axios.post('/api/TrivCreator', { tcr_user_id: userId, tcr_cat_id: catId })
      .then(res => { console.log('createTriviaCreator, res.data', res.data) })
      .catch(err => console.log('error at post TriviaSet', err))
  }
  createTrivList = (catId) => {
    const { userId } = this.state;
    console.log('createTrivCreator, userId:', userId, 'catId:', catId)
    axios.post('/api/TrivList', { tr_user_id: userId, tr_cat_id: catId })
      .then(res => { console.log('createTriviaList, res.data', res.data) })
      .catch(err => console.log('error at post TriviaSet', err))
  }
  createQASet = (qaItem) => {
    axios.post('/api/TrivSet', { qaItem }).then(res => {
      console.log('HContent.js, createQASet, response (take id and post to QACreator):', res)
    })
    // take res.data.id from post put (user.id, res.data.id)
    axios.post('/api/QACreator')
  }
  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({ [name]: value })
  }
  handleSelect = (e) => {
    let id = e.target.id
    let value = e.target.value
    this.props.updateTrivSwitch(Number(id));
    this.setState({
      trivSwitch: Number(id),
      trivSetToMap: this.props[value],
    });
  }
  propsBtn = () => {
    console.log(this.props);
  }
  loadButtons = () => {
    const { handleSelect } = this;
    const trivBtns = [
      { id: 1, value: 'newsAllList', text: 'All Trivia' },
      { id: 2, value: 'newsMyList', text: 'My Trivia Collection' },
      { id: 3, value: 'newsMyListCreated', text: 'My Trivia Sets Creations' }];
    const triviaButtons = trivBtns.map(elem => {
      return <button key={elem.id} id={elem.id} value={elem.value} className={elem.id === this.state.trivSwitch ? 'btn' : 'btn-off'} onClick={handleSelect}>{elem.text}</button>
    })
    // console.log('here are the trivia buttons', triviaButtons)
    this.setState({ triviaButtons: triviaButtons })
    // return triviaButtons;
  }

  render() {
    const { trivSetToMap, trivSetName, trivSwitch } = this.state;

    // console.log('HContent, this.props', this.props)
    // console.log('HContent, this.state', this.state)
    return (
      <div className='HContent'>
        <div className='inputTrivCard'>
          <div className='TrivCard'>
            {/* <div>Reminder to put 'Create a new trivia set' My Trivia Set Creations</div> */}
            <textarea className='inputTrivText' placeholder='New Trivia Set' name='trivSetName' value={trivSetName} onChange={this.handleChange} />
            <button className='btn-2' onClick={this.createTriviaSet}>Create</button>
          </div>
        </div>
        <div className='TrivBtns'>
          <div className='BtnBox'>
            {/* {triviaButtons} */}
            {this.state.triviaButtons}
          </div>
        </div>
        <div className='TrivBox'>
          <HCSet getAllSets={this.getAllSets}
            trivArray={trivSetToMap} userId={this.state.userId} />
        </div>

      </div>
    )
  }
}
function mapStateToProps(state) {
  const { id, trivSwitch, newsAllList, newsMyList, newsMyListCreated } = state;
  return {
    id,
    trivSwitch,
    newsAllList,
    newsMyList,
    newsMyListCreated
  };
}
export default withRouter(connect(mapStateToProps, { updateTrivSwitch, updateNewsAllList, updateNewsMyList, updateNewsMyListCreated })(HContent)); 