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
      // trivSwitch: 1, // Trivia List buttons on/off assignment
      trivSetName: '',
      trivSetToMap: props.newsAllList,
      // userId: this.props.id,
    }
  }
  componentDidMount = async () => {
    if (this.props.newsAllList) {
      this.loadButtons();
      this.getAllSets(1);
      this.getAllSets(2);
      this.getAllSets(3);
      await this.loadContent();
    }
  }
  componentDidUpdate = (prevProps) => {
    const { trivArray, trivSwitch, newsAllList, newsMyList, newsMyListCreated } = this.props;
    if (newsAllList !== prevProps.newsAllList || newsMyList !== prevProps.newsMyList || newsMyListCreated !== prevProps.newsMyListCreated) {
      // console.log('PREVPROPS.newsMyList', prevProps.newsMyList)
      // console.log('newsMyList', newsMyList)
      this.loadContent()
    } else if (trivSwitch !== prevProps.trivSwitch) {
      this.loadButtons()
      this.loadContent()
    }
  }
  loadContent = () => {
    if (this.props.trivSwitch === 1) {
      this.setState({
        trivSetToMap: this.props.newsAllList
      })
    } else if (this.props.trivSwitch === 2) {
      this.setState({
        trivSetToMap: this.props.newsMyList
      })
    } else if (this.props.trivSwitch === 3) {
      this.setState({
        trivSetToMap: this.props.newsMyListCreated
      })
    }
  }
  getAllSets = (num) => {
    if (num === 0) {
      this.getTriviaSet();
      this.getMyTriviaSet();
      this.getMyTriviaCreated();
    } else if (num === 1) {
      this.getTriviaSet();
    } else if (num === 2) {
      this.getMyTriviaSet();
    } else if (num === 3) {
      this.getMyTriviaCreated();
    }
  }
  getTriviaSet = () => {
    console.log('HContent, getTriviaSet')
    axios.get('/api/TrivSet')
      .then(res => {
        this.props.updateNewsAllList(res.data)
      })
      .catch(err => console.log('error at get TriviaSet', err))
  }
  getMyTriviaSet = () => {
    if (this.props.host && this.props.host.userId) {
      console.log('getMyTriviaSet')
      axios.get('/api/MyTrivSet', { params: { userId: this.props.host.userId } })
        .then(res => {
          this.props.updateNewsMyList(res.data)
        })
        .catch(err => console.log('error at get TriviaSet', err))
    }
  }
  getMyTriviaCreated = () => {
    if (this.props.host && this.props.host.userId) {
      console.log('getTriviaSetCreated')
      axios.get('/api/MyTrivSetCreated', { params: { userId: this.props.host.userId } })
        .then(res => {
          this.props.updateNewsMyListCreated(res.data)
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
    // this.getAllSets(this.props.trivSwitch);
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
  handleSelect = async (e) => {
    let id = e.target.id
    let value = e.target.value
    console.log('HCONTANT button, id', id, 'value', value)
    await this.setState({
      trivSetToMap: this.props[value]
    })
    this.props.updateTrivSwitch(Number(id));
  }
  propsBtn = () => {
    console.log(this.props);
  }
  loadButtons = async () => {
    if (this.props.trivSwitch === null) {
      await this.props.updateTrivSwitch(1)
    }
    const { handleSelect } = this;
    const trivBtns = [
      { id: 1, value: 'newsAllList', text: 'Browse All Trivia' },
      { id: 2, value: 'newsMyList', text: 'My Trivia Collection' },
      { id: 3, value: 'newsMyListCreated', text: 'My Trivia Sets Creations' }];
    const triviaButtons = trivBtns.map(elem => {
      // console.log('button from', elem.text, 'id:', elem.id, 'trivSwitch', this.props.trivSwitch)
      return <button key={elem.id} id={elem.id} value={elem.value} className={elem.id === this.props.trivSwitch ? 'btn' : 'btn-off'} onClick={handleSelect}>{elem.text}</button>
    })
    // console.log('here are the trivia buttons', triviaButtons)
    this.setState({ triviaButtons: triviaButtons })
    // return triviaButtons;
  }
  render() {
    const { trivSetName, } = this.state;
    console.log('HContent, this.state', this.state)
    console.log('HContent, this.props', this.props)
    return (
      <div className='HContent'>


        <div className='TrivBtns'>
          <div className='BtnBox'>
            {/* {triviaButtons} */}
            {this.state.triviaButtons}
          </div>
        </div>
        <div className='TrivBox'>
          <HCSet getAllSets={this.getAllSets}
            trivArray={this.state.trivSetToMap} />
        </div>

      </div >
    )
  }
}
function mapStateToProps(state) {
  const { host, trivSwitch, newsAllList, newsMyList, newsMyListCreated } = state;
  return {
    host,
    trivSwitch,
    newsAllList,
    newsMyList,
    newsMyListCreated
  };
}
export default withRouter(connect(mapStateToProps, { updateTrivSwitch, updateNewsAllList, updateNewsMyList, updateNewsMyListCreated })(HContent));

{/* <div className='inputTrivCard'>
<div className='TrivCard'>
  {/* <div>Reminder to put 'Create a new trivia set' My Trivia Set Creations</div>
  <textarea className='inputTrivText' placeholder='New Trivia Set' name='trivSetName' value={trivSetName} onChange={this.handleChange} />
  <button className='btn-2' onClick={this.createTriviaSet}>Create</button>
</div> 
      </div>*/}