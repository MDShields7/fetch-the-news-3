import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router';
import axios from 'axios';
// import './HContentSet.css';

class HContentSet extends Component {
  constructor(props){
    super(props)
    this.state ={
      editCheck: false,
      editText: false,
      tempTrivId: '',
      tempTrivName: '',
      editElement: null
    }
  }
  componentDidMount(){
  }
  componentDidUpdate(prevProps){
  }

  editTriviaSet = (catId, catName) => {
    console.log('editTriviaSet firing off')
    this.setState({
      editText: true,
      tempTrivId: catId,
      tempTrivName: catName,
    })
  }
  submitTriviaSet = (catId) => {
    console.log('submitTriviaSet firing off')
    console.log('catId', catId, 'tempTrivName', this.state.tempTrivName)
    axios.put(`/api/EditMyTrivSet/${catId}`, {catName:this.state.tempTrivName})
      .then(res => {
      console.log('******HContentSet, submit Trivia Set, res.data', res.data);
      console.log('submit trivia -------------',this.props.trivArray.id )
      this.props.getAllSets(0);
    })
      .catch(err => console.log('error at post editTriviaSet', err))
      this.props.getAllSets(0);
  }
  deleteTrivSet = (catId) => {
    console.log('deleteTrivSet starting now... ')
    const{userId}= this.props;
    axios.delete(`/api/DeleteTrivSet/${catId}/${userId}`)
    .then(res => {
      console.log('******HContentSet, delete Trivia Set, res.data', res.data);
      this.props.getAllSets(0);
    })
      .catch(err => console.log('error at post editTriviaSet', err))

  }
  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({[name]: value})
  }
  render() {
    const{editCheck, editText, tempTrivName}=this.state;
    const { trivArray } = this.props;

    const TrivCard = trivArray.map(elem => {
      let elemId = elem.cat_id;
      let elemName = elem.cat_name;
      // let key = elemId;
      let sharedIndex = this.props.newsMyListCreated.findIndex(e => e.cat_id === elemId) !== -1
      let editBtn = () => {
        this.setState({editElement: elemId});
        this.editTriviaSet(elemId,elemName);
      }
      let submitBtn = () => {
        this.setState({ tempTrivId: elemId, tempTrivName: elemName});
        this.submitTriviaSet(elemId);
        this.setState({ editElement: '' });
      }
      let deleteBtn = () => {
        this.deleteTrivSet(elemId);
        console.log('deleteBtn finished')
      }
      return (<>
        <input className='inputTrivText' type="text" name='tempTrivName' value={this.state.editElement === elemId? tempTrivName : elemName} onChange={this.handleChange}/>

        <button className={ sharedIndex ? 'btn-2' : 'btn-2-off' } onClick={ this.state.editElement === elemId ? submitBtn : editBtn }>
        {this.state.editElement === elemId ? 'Submit' : 'Edit'}</button>

        <button className='btn-2' onClick={deleteBtn}>Delete</button>
      </> )
    })
    // console.log('HContentSet, this.state',this.state)
    // console.log('HContentSet, this.props', this.props)

    return (
      <div className='TrivCard'>
        {TrivCard}
      </div>
    )
  }
}
function mapStateToProps( state ){
  const {newsMyListCreated} = state;
  return {
    newsMyListCreated
  };
}
export default withRouter(connect (mapStateToProps)(HContentSet)); 