import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import axios from 'axios';
import {
  updateQAPlayingList,
  updateNewsMyListCreated
} from "../../ducks/reducer";

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
  componentDidMount = async () => {
    console.log('I feel like a NEEEEEEEW man!!!, componentDidMount')
    // if (!this.props.trivArray[0]) {
    //   this.props.trivArray = []
    // }
    this.loadCard()
  }
  componentDidUpdate = async (prevProps) => {
    const { trivArray, trivSwitch, newsAllList, newsMyList, newsMyListCreated } = this.props;
    console.log('I\'m RELOADIIIIIIIING!, componentDidUpdate', newsMyListCreated !== prevProps.newsMyListCreated)
    if (
      trivArray !== prevProps.trivArray
      || trivSwitch !== prevProps.trivSwitch
      // || newsAllList !== prevProps.newsAllList
      // || newsMyList !== prevProps.newsMyList || 
    ) {
      // await this.getAllTriviaQA()
      this.loadCard()
    } else if (
      newsMyListCreated !== prevProps.newsMyListCreated &&
      newsMyListCreated[(newsMyListCreated.length - 1)].qaList === undefined
    ) {
      await this.getAllTriviaQA()
      this.loadCard()
    }
    // if (newsMyListCreated !== prevProps.newsMyListCreated && newsMyListCreated[(newsMyListCreated.length - 1)].qaList === undefined) {
    //   await this.getAllTriviaQA()
    //   this.loadCard()
    // }
    // } else if (!newsMyListCreated.hasOwnProperty('qaList')) {
    //   await this.getAllTriviaQA()
    //   this.loadCard()
    // }
  }
  getAllTriviaQA = async () => {
    console.log('HContentSet, getAllTriviaQA ACTIVATED!!!')
    // this.setState({ qaList: [] })
    let newList = this.props.newsMyListCreated.slice()
    let index = 0;
    if (this.props.newsMyListCreated[0]) {
      // for (let i = 0; i < this.props.newsMyListCreated.length; i++) {
      await this.getTriviaQA(index, newList)
      // }
    }
  }
  getTriviaQA = async (index, newList) => {
    if (index < newList.length) {
      let id = newList[index].cat_id
      console.log('HContentSet, getTriviaQA')
      console.log('index', index, 'id', id)
      await axios
        .get("/api/TrivQASet", {
          params: { catId: id }
        })
        .then(res => {
          console.log("getTriviaQA for index", index, 'cat_id', id, ', result is ', res.data);
          // this.rollQAIntoSet(id, res.data, newList)
          // console.log('newList', newList)
          for (let i = 0; i < this.props.newsMyListCreated.length; i++) {
            if (newList[i].cat_id === id) {
              let itemCopy = newList[i]
              let newItem = Object.assign({}, itemCopy, { qaList: res.data })
              newList[i] = newItem;
              index += 1;
              console.log('newList', newList)
            }
          }
        })
        .catch(err => {
          console.log("HLobby, getTriviaQA, error", err);
        });
      return this.getTriviaQA(index, newList)
    } else {
      // return newList
      this.props.updateNewsMyListCreated(newList)
    }
  };
  // rollQAIntoSet = (catId, qaList, newList) => {
  //   console.log('HContentSet, saveQAToSet, catId', catId, 'res.data', res.data)
  //   for (let i = 0; i < this.props.newsMyListCreated.length; i++) {
  //     if (newList[i].cat_id === catId) {
  //       let itemCopy = newList[i]
  //       let newItem = Object.assign({}, itemCopy, { qaList: res.data })
  //       newList[i] = newItem;
  // console.log(this)
  // console.log('this.props.newsMyListCreated[i]', this.props.newsMyListCreated[i])
  // console.log('itemCopy', itemCopy)
  // console.log('newItem w/ qaList', newItem)
  // console.log('newList', newList)
  // console.log('newList w/ qaList in item', newList)
  // return newList
  // this.props.updateNewsMyListCreated(newList)
  //     }
  //   }
  // }
  editTriviaSet = (catId, catName) => {
    console.log(`editTriviaSet firing off: editText, tempTrivId, tempTrivName`)
    this.setState({
      editElement: catId,
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
  handleChange = async (e) => {
    console.log('HContentSet, handleChange, e.target.name', e.target.name)
    console.log('HContentSet, handleChange, e.target.value', e.target.value)
    const name = e.target.name
    const value = e.target.value
    await this.setState({ [name]: value })
    this.loadCard()
  }
  updateCard = () => {

  }
  loadCard = () => {
    // console.log('HCONTENTSET, trivArray is', this.props.trivArray)
    // console.log('HCONTENTSET, trivSwitch is', this.props.trivSwitch)
    // console.log('HCONTENTSET, this.state.editElement is', this.state.editElement)
    const { tempTrivName } = this.state;
    let TrivCard;
    if (this.props.trivArray[0] === undefined) {
      if (this.props.trivSwitch === 2) {
        TrivCard = [<h3 key='one'>Login to start a trivia collection</h3>]
      } else if (this.props.trivSwitch === 3) {
        TrivCard = [<h3 key='one'>Login to create a trivia category</h3>]
      }
    } else {
      TrivCard = this.props.trivArray.map(elem => {
        const { tempTrivName } = this.state;
        let elemId = elem.cat_id;
        let elemName = elem.cat_name;
        // console.log('this.state.editElement', this.state.editElement)
        // console.log('elemId', elemId)

        let sharedIndexMyList =
          this.props.newsMyList.findIndex(e => e.cat_id === elemId) !== -1
        let sharedIndexMyListCreated =
          this.props.newsMyListCreated.findIndex(e => e.cat_id === elemId) !== -1
        let sharedIndex = sharedIndexMyList || sharedIndexMyListCreated
        let buttons = (id, name) => {
          // console.log('buttons, id', id)
          // console.log('buttons, name', name)
          // console.log('this.state.editElement', this.state.editElement)
          // console.log('elemId', elemId)
          if (this.props.trivSwitch === 1) {
            // Add to Favorites
            // console.log('sharedIndexMyList', sharedIndexMyList)
            // console.log('sharedIndexMyListCreated', sharedIndexMyListCreated)
            let addFavBtn = async () => {
              await this.setState({ tempTrivId: id });
              this.addFavTrivList(id)
            }
            // Add
            return <>{sharedIndex ? <div>(in my collection)</div> : <button className='btn-2' onClick={addFavBtn} >Add</button>}</>
          } else if (this.props.trivSwitch === 2) {
            // Remove from favorites
            // console.log('button 2', sharedIndexMyList)
            let removeFavBtn = async () => {
              await this.setState({ tempTrivId: id, tempTrivName: name });
              this.removeFavTrivList(id)
            }
            // Remove
            return <>{sharedIndexMyListCreated ? <div>(in my creations)</div> : <button className='btn-2' onClick={removeFavBtn} >Remove</button>}</>
          } else if (this.props.trivSwitch === 3) {
            // Edit my trivia set
            let submitBtn = () => {
              this.setState({ tempTrivId: id, tempTrivName: name });
              this.submitTriviaSet(id);
              this.setState({ editElement: '' });
            }
            let editBtn = async () => {
              // console.log('ACTIVATED edit button, id, name', id, name)
              // this.setState({ editElement: id });
              await this.editTriviaSet(id, name);
              this.loadCard()
            }
            let deleteBtn = () => {
              this.deleteTrivCreator(id);
              // console.log('deleteBtn finished')
            }
            // console.log('submitBtn', submitBtn)
            // console.log('editBtn', editBtn)
            return <>
              <button className='btn-2' onClick={this.state.editElement === elemId ? submitBtn : editBtn}>
                {this.state.editElement === id ? 'Submit' : 'Edit'}</button>
              <button className='btn-2' onClick={deleteBtn}>Delete</button></>
          }
        }
        let createSet = this.props.trivSwitch === 3
        let editing = this.state.editElement === elemId;
        let qaCards = (elem) => {
          let qaListCards = []
          if (elem.qaList && elem.qaList[0]) {
            console.log('qaCards, elem', elem)
            for (let index = 0; index < elem.qaList.length; index++) {
              qaListCards.push(
                <div key={index} className='TrivCardWideMid'>

                  <div className='qaAnsGroup'>
                    <div className='qaAnsTitle'>Question:</div>
                    <div>{elem.qaList[index].qa_question}</div>
                  </div>
                  <div className='qaAnsGroup'>
                    <div className='qaAnsTitle'>Correct Answer:</div>
                    <div>{elem.qaList[index].qa_ans1}</div>
                  </div>
                  <div className='qaAnsGroup'>
                    <div className='qaAnsTitle'>Incorrect Answer:</div>
                    <div>{elem.qaList[index].qa_ans2}</div>
                  </div>
                  <div className='qaAnsGroup'>
                    <div className='qaAnsTitle'>Incorrect Answer:</div>
                    <div>{elem.qaList[index].qa_ans3}</div>
                  </div>
                  <div className='qaAnsGroup'>
                    <div className='qaAnsTitle'>Incorrect Answer:</div>
                    <div>{elem.qaList[index].qa_ans4}</div>
                  </div>
                </div>
              )
            }
            // })
            // }
          }
          return qaListCards;
        }
        return (<>
          {!createSet ? (
            <div key={elemId} className={'TrivCard'}>
              <textarea className='inputTrivText' type="text" name='tempTrivName' value={editing ? tempTrivName : elemName} onChange={this.handleChange} />
              <div className='TrivText'>{elem.qa_amount}{elem.qa_amount !== 1 ? ' questions' : ' question'}</div>
              {!editing ? buttons(elemId, elemName) : <></>}
            </div>) : (<></>)
          } {
            createSet ? (<>
              <div className='TrivCardWideTop'>
                <p className='align-left'><textarea className='inputWideName' type="text" name='tempTrivName' value={editing ? tempTrivName : elemName} onChange={this.handleChange} /></p>
                <div className='TrivAmount'>{elem.qa_amount}{elem.qa_amount !== 1 ? ' questions' : ' question'}</div>
              </div>
              <>{qaCards(elem)}</>
              <div key={elemId} className='TrivCardWideBot'>
                <div className='TCWBtnBox'>
                  {buttons(elemId, elemName)}
                </div>
              </div>
            </>) : (<></>)
          }
        </>)

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
export default withRouter(connect(mapStateToProps, { updateQAPlayingList, updateNewsMyListCreated })(HContentSet));
// console.log(this)
// console.log('this.props.newsMyListCreated[i]', this.props.newsMyListCreated[i])
// console.log('itemCopy', itemCopy)
// console.log('newItem w/ qaList', newItem)
// console.log('newList', newList)
// console.log('newList w/ qaList in item', newList)
// return newList
// this.props.updateNewsMyListCreated(newList)