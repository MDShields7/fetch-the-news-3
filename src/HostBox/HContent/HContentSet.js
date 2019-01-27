import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import axios from 'axios';
// import './HContentSet.css';

class HContentSet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editCheck: false,
      editText: false,
      tempTrivId: '',
      tempTrivName: '',
      removeElement: null,
      editElement: null,
      TrivCard: []
    }
  }
  componentDidMount() {
    this.loadCard()
  }
  componentDidUpdate(prevProps) {
    if (this.props.trivArray !== prevProps.trivArray
      || this.props.trivSwitch !== prevProps.trivSwitch
      || this.props.newsAllList !== prevProps.newsAllList
      || this.props.newsMyList !== prevProps.newsMyList
      || this.props.newsMyListCreated !== prevProps.newsMyListCreated) {
      this.loadCard()
    }
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
    axios.put(`/api/EditMyTrivSet/${catId}`, { catName: this.state.tempTrivName })
      .then(res => {
        console.log('******HContentSet, submit Trivia Set, res.data', res.data);
        console.log('submit trivia -------------', this.props.trivArray.id)
        this.props.getAllSets(3);
      })
      .catch(err => console.log('error at post submitTriviaSet', err))
    this.props.getAllSets(3);
  }
  deleteTrivCreator = (catId) => {
    console.log('deleteTrivCreator starting now... ')
    const { userId } = this.props.host;
    axios.delete(`/api/DeleteTrivCreator/${catId}/${userId}`)
      .then(res => {
        console.log('******HContentSet, delete Trivia Set, res.data', res.data);
        this.props.getAllSets(3);
      })
      .catch(err => console.log('error at post deleteTriviaSet', err))
  }
  addFavTrivList = () => {
    axios.post("/api/AddTrivList", { tr_user_id: this.props.host.userId, tr_cat_id: this.state.tempTrivId })
      .then(response => {
        console.log('HContentSet, addFav, post response', response)
        this.props.getAllSets(1);
        this.props.getAllSets(2);
      }).catch(error => {
        console.log('Error in addFavTrivSet', error)
      });
  }
  removeFavTrivList = () => {
    const { userId } = this.props.host
    const catId = this.state.tempTrivId
    axios.delete(`/api/RemoveTrivList/${catId}/${userId}`)
      .then(response => {
        console.log('HContentSet, removeFav, post response', response)
        this.props.getAllSets(1);
        this.props.getAllSets(2);
      }).catch(error => {
        console.log('Error in addFavTrivSet', error)
      });
  }
  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({ [name]: value })
  }
  loadCard = () => {
    console.log('HCONTENTSET, trivArray is', this.props.trivArray)
    console.log('HCONTENTSET, trivSwitch is', this.props.trivSwitch)
    const { tempTrivName } = this.state;
    let TrivCard;
    if (this.props.trivArray[0] === undefined) {
      TrivCard = [<div key='one'>Login to use this page</div>]
    } else {
      // console.log('mapping over trivArray')
      TrivCard = this.props.trivArray.map(elem => {
        let elemId = elem.cat_id;
        let elemName = elem.cat_name;

        let sharedIndexMyList =
          this.props.newsMyList.findIndex(e => e.cat_id === elemId) !== -1
        let sharedIndexMyListCreated =
          this.props.newsMyListCreated.findIndex(e => e.cat_id === elemId) !== -1
        let sharedIndex = sharedIndexMyList || sharedIndexMyListCreated
        let buttons = (id, name) => {
          if (this.props.trivSwitch === 1) {
            // Add to Favorites
            // console.log('sharedIndexMyList', sharedIndexMyList)
            // console.log('sharedIndexMyListCreated', sharedIndexMyListCreated)
            let addFavBtn = async () => {
              await this.setState({ tempTrivId: id });
              this.addFavTrivList(id)
            }
            // Add
            return <>{sharedIndex ? <div>in my collection</div> : <button className='btn-2' onClick={addFavBtn} >Add</button>}</>
          } else if (this.props.trivSwitch === 2) {
            // Remove from favorites
            console.log('button 2', sharedIndexMyList)
            let removeFavBtn = async () => {
              await this.setState({ tempTrivId: id, tempTrivName: name });
              this.removeFavTrivList(id)
            }
            // Remove
            return <>{sharedIndexMyListCreated ? <div>in my creations</div> : <button className='btn-2' onClick={removeFavBtn} >Remove</button>}</>
          } else if (this.props.trivSwitch === 3) {
            // Edit my trivia set
            let submitBtn = () => {
              this.setState({ tempTrivId: id, tempTrivName: name });
              this.submitTriviaSet(id);
              this.setState({ editElement: '' });
            }
            let editBtn = (id, name) => {
              this.setState({ editElement: id });
              this.editTriviaSet(id, name);
            }
            let deleteBtn = () => {
              this.deleteTrivCreator(id);
              console.log('deleteBtn finished')
            }
            return <>
              <button className='btn-2' onClick={this.state.editElement === elemId ? submitBtn : editBtn}>
                {this.state.editElement === id ? 'Submit' : 'Edit'}</button>
              <button className='btn-2' onClick={deleteBtn}>Delete</button></>
          }
        }
        return (<div key={elemId} className='TrivCard'>
          <textarea className='inputTrivText' type="text" name='tempTrivName' value={this.state.editElement === elemId ? tempTrivName : elemName} onChange={this.handleChange} />
          {buttons(elemId, elemName)}
        </div>)

      })
    }
    // console.log('setting TrivCard to state!!!!!!!!!')
    this.setState({ TrivCard: TrivCard })
  }
  render() {
    console.log('HContentSet, this.props', this.props)
    console.log('HContentSet, this.state', this.state)
    return (
      <>
        {this.state.TrivCard}
      </>
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
export default withRouter(connect(mapStateToProps)(HContentSet)); 