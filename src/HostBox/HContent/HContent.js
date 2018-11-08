import React, { Component } from 'react'
import axios from 'axios';
import {connect} from 'react-redux';
import {updateNewsAllList, updateNewsMyList, updateNewsMyListCreated} from '../../ducks/reducer';
import HCSet from './HContentSet';
import './HContent.css'

class HContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      //temporary stuff
      //createTriviaSetId:
      trivSwitch: 1, // Trivia List buttons on/off assignment
      trivSetName: '',
      trivSetToMap: props.newsAllList,
      userId: 2,
    }
  }
  componentDidMount = () => {
    this.getTriviaSet();
  //   this.getTriviaSet();
  //   this.getMyTriviaCreated();
    console.log('componentDidMount, newsAllList', this.props.newsAllList)
  }
  componentDidUpdate = (prevProps) => {
    if (this.props === prevProps) {
      this.getMyTriviaSet();
      this.getMyTriviaCreated();
      // this.getTriviaSet();
    }
  }
  getTriviaSet = () => {
    console.log('getTriviaSet working')
    axios.get('/api/TrivSet').then(res => {
      this.props.updateNewsAllList(res.data)
      this.setState({
        trivSetToMap: this.props.newsAllList
      })
      // console.log('HContent, this.props.newAllList', this.props.newsAllList)
    })
    .catch(err => console.log('error at get TriviaSet', err))
  }
  getMyTriviaSet = () => {
    axios.get('/api/MyTrivSet', {params:{userId:this.state.userId}}).then(res => {
      this.props.updateNewsMyList(res.data)
      // console.log('HContent, this.props.newsMyList', this.props.newsMyList)
    })
    .catch(err => console.log('error at get TriviaSet', err))
  }
  getMyTriviaCreated = () => {
    // axios.get(`/api/MyTrivSetCreated/userId=${this.state.userId}`)
    axios.get('/api/MyTrivSetCreated', {params:{userId:this.state.userId}}).then(res => {
      this.props.updateNewsMyListCreated(res.data)
      // console.log('HContent, this.props.newsMyListCreated', this.props.newsMyListCreated)
    })
    .catch(err => console.log('error at get TriviaSet', err))
  }
  createTriviaSet = () => {
    // console.log('createTriviaSet w/ req.body',this.state.trivSetName)
    axios.post('/api/TrivSet', {trivSetName: this.state.trivSetName})
    .then(res => { 
      this.createTrivCreator(res.data[0]['cat_id'])
      this.getTriviaSet() })
    .catch(err => console.log('error at post TriviaSet', err))
    }
  createTrivCreator = (catId) => {
    const{userId} = this.state;
    // console.log('createTrivCreator, userId:', userId,'catId:', catId)
    axios.post('/api/TrivCreator', {tcr_user_id: userId, tcr_cat_id: catId})
      .then(res => {console.log('createTriviaCreator, res.data',res.data)})
      .catch(err => console.log('error at post TriviaSet', err))
  }

  createQASet = (qaItem) => {
    axios.post('/api/TrivSet', {qaItem}).then(res => {
    console.log('HContent.js, createQASet, response (take id and post to QACreator):', res)
    })
    // take res.data.id from post put (user.id, res.data.id)
    axios.post('/api/QACreator')
  }
  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({[name]: value})
  }
  handleSelect = (e) => {
    let id = e.target.id
    let value = e.target.value
    console.log('handleselect------------------')
    // console.log('id:', id, 'typeof id:', typeof id)
    // console.log('value:', value, 'typeof value:', typeof value)
    this.setState({
      trivSwitch: Number(id),
      trivSetToMap: this.props[value],
    });
  }
  propsBtn = () => {
    console.log(this.props);
  }

  render() {
    const {handleSelect} = this;
    const {trivSetToMap,trivSetName, trivSwitch} = this.state;
    
    const trivBtns = [
      {id: 1, value:'newsAllList', text:'All Trivia'},
      {id: 2, value:'newsMyList', text:'My Trivia Collection'},
      {id: 3, value:'newsMyListCreated', text:'My Trivia Sets Creations'}
    ]
    const triviaButtons = trivBtns.map(elem => {
      // console.log('HContents, triviaButtons, elem.id, this.state.trivSwitch', elem.id, this.state.trivSwitch)
      return <button key={elem.id} id={elem.id} value={elem.value} className={elem.id === this.state.trivSwitch ? 'btn' : 'btn-off'}onClick={handleSelect}>{elem.text}</button>
    })
console.log('HContent, this.state',this.state)
    return (
      <div className='HContent'>
        {/* <button onClick={this.propsBtn}>Check HContent.js Props</button> */}
        <div className='TrivBtns'>
          {triviaButtons}
        </div>
        <div className='TrivBox'> 
          <HCSet getTriviaSet={this.getTriviaSet}
          getMyTriviaSet={this.getMyTriviaSet} 
          getMyTriviaCreated={this.getMyTriviaCreated}
          trivArray={trivSetToMap} trivSetToMap={trivSetToMap} userId={this.state.userId}/>
        </div>

        <div>
          <div>Create a new trivia set</div>
          <input type="text" name='trivSetName' value={trivSetName} onChange={this.handleChange}/>
          <button onClick={this.createTriviaSet}>Create</button>
        </div>
      </div>
    )
  }
}
function mapStateToProps( state ){
  const {newsAllList, newsMyList, newsMyListCreated} = state;
  return {
    newsAllList,
    newsMyList,
    newsMyListCreated
  };
}
export default connect (mapStateToProps, {updateNewsAllList, updateNewsMyList,updateNewsMyListCreated})(HContent); 