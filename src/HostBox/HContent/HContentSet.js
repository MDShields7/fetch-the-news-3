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
    // this.loadCard()
  }
  componentDidMount() {
    this.loadCard()
  }
  componentDidUpdate(prevProps) {
    if (this.props.trivArray !== prevProps.trivArray) {
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
        this.props.getAllSets(0);
      })
      .catch(err => console.log('error at post editTriviaSet', err))
    this.props.getAllSets(0);
  }
  deleteTrivSet = (catId) => {
    console.log('deleteTrivSet starting now... ')
    const { userId } = this.props;
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
    this.setState({ [name]: value })
  }
  loadCard = () => {
    console.log('HCONTENTSET, trivArray is', this.props.trivArray)
    // const { this.props.trivArray } = this.props;
    const { tempTrivName } = this.state;
    let TrivCard;
    if (this.props.trivArray[0] === undefined) {
      TrivCard = [<div key='one'>Login to use this page</div>]
    } else {
      // console.log('mapping over trivArray')
      TrivCard = this.props.trivArray.map(elem => {
        let elemId = elem.cat_id;
        let elemName = elem.cat_name;
        // let key = elemId;
        // let sharedIndex = this.props.newsMyListCreated.findIndex(e => e.cat_id === elemId) !== -1
        let addFavorite = () => {
          axios.post("/api/TrivList", { tr_user_id: this.props.host.userId, tr_cat_id: this.state.tempTrivId })
            .then(response => {
              console.log('HContentSet, addFav, post response', response)
              this.props.updateHost({ userId: response.data.user.user_id, userName: response.data.user.user_name })
            }).catch(error => {
              console.log('Error in login', error)
            });
        }

        let buttons = (id, name) => {
          if (this.props.trivSwitch === 1) {
            // Add to Favorites
            let addFavBtn = () => {
              this.setState({ tempTrivId: id, tempTrivName: name });
            }
            return <>
              addFavBtn</>
          } else if (this.props.trivSwitch === 2) {
            // Remove from favorites
            let removeFavBtn = (id) => {
              this.setState({ editElement: id });
            }
            return <>
              removeFavBtn</>
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
            let deleteBtn = (id) => {
              this.deleteTrivSet(id);
              console.log('deleteBtn finished')
            }
            return <>
              <button className='btn-2' onClick={this.state.editElement === elemId ? submitBtn(id, name) : editBtn(id, name)}>
                {this.state.editElement === id ? 'Submit' : 'Edit'}</button>
              <button className='btn-2' onClick={deleteBtn(id)} name>Delete</button></>
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
  const { trivSwitch, newsMyListCreated } = state;
  return {
    trivSwitch,
    newsMyListCreated
  };
}
export default withRouter(connect(mapStateToProps)(HContentSet)); 