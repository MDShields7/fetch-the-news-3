import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import axios from 'axios';
import {
  updateQAPlayingList,
  updateNewsMyListCreated
} from "../../ducks/reducer";
import HQSet from './HQSet'

class HContentSet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editCheck: false,
      editText: false,
      tempTrivId: '',
      tempTrivName: '',
      // tempTrivQ: '',
      // tempTrivQA1: '',
      // tempTrivQA2: '',
      // tempTrivQA3: '',
      // tempTrivQA4: '',
      removeElement: null,
      editElement: '',
      TrivCard: []
    }
  }
  componentDidMount = async () => {
    this.loadCard()
  }
  componentDidUpdate = async (prevProps) => {
    const { trivArray, trivSwitch, newsAllList, newsMyList, newsMyListCreated } = this.props;
    if (
      trivArray !== prevProps.trivArray
      || trivSwitch !== prevProps.trivSwitch
    ) {
      this.loadCard()
    } else if (
      newsMyListCreated !== prevProps.newsMyListCreated &&
      newsMyListCreated[(newsMyListCreated.length - 1)].qaList === undefined
    ) {
      await this.getAllTriviaQA()
      this.loadCard()
    }
  }
  getAllTriviaQA = async () => {
    console.log('HContentSet, getAllTriviaQA ACTIVATED!!!')
    let newList = this.props.newsMyListCreated.slice()
    let index = 0;
    if (this.props.newsMyListCreated[0]) {
      await this.getTriviaQA(index, newList)
    }
  }
  getTriviaQA = async (index, newList) => {
    if (index < newList.length) {
      let id = newList[index].cat_id
      await axios
        .get("/api/TrivQASet", {
          params: { catId: id }
        })
        .then(res => {
          for (let i = 0; i < this.props.newsMyListCreated.length; i++) {
            if (newList[i].cat_id === id) {
              let itemCopy = newList[i]
              let newItem = Object.assign({}, itemCopy, { qaList: res.data })
              newList[i] = newItem;
              index += 1;
            }
          }
        })
        .catch(err => {
          console.log("HLobby, getTriviaQA, error", err);
        });
      return this.getTriviaQA(index, newList)
    } else {
      this.props.updateNewsMyListCreated(newList)
    }
  };
  editTriviaSet = (catId, catName) => {
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
        this.props.getAllSets(3);
      })
      .catch(err => console.log('error at post submitTriviaSet', err))
    this.props.getAllSets(3);
  }
  deleteTrivCreator = (catId) => {
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
    let TrivCard;
    if (this.props.trivArray[0] === undefined) {
      if (this.props.trivSwitch === 2) {
        TrivCard = [<h3 key='one'>Login to start a trivia collection</h3>]
      } else if (this.props.trivSwitch === 3) {
        TrivCard = [<h3 key='one'>Login to create a trivia category</h3>]
      }
    } else {
      TrivCard = this.props.trivArray.map((elem, elemIndex) => {
        const { tempTrivName, tempTrivQ, tempTrivA1, tempTrivA2, tempTrivA3, tempTrivA4 } = this.state;
        let elemId = elem.cat_id;
        let elemName = elem.cat_name;
        let sharedIndexMyList =
          this.props.newsMyList.findIndex(e => e.cat_id === elemId) !== -1
        let sharedIndexMyListCreated =
          this.props.newsMyListCreated.findIndex(e => e.cat_id === elemId) !== -1
        let sharedIndex = sharedIndexMyList || sharedIndexMyListCreated
        let buttons = (id, name) => {
          if (this.props.trivSwitch === 1) {
            let addFavBtn = async () => {
              await this.setState({ tempTrivId: id });
              this.addFavTrivList(id)
            }
            // Add
            return <>{sharedIndex ? <div>(in my collection)</div> : <button className='btn-2' onClick={addFavBtn} >Add</button>}</>
          } else if (this.props.trivSwitch === 2) {
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
              await this.editTriviaSet(id, name);
              this.loadCard()
            }
            let deleteBtn = () => {
              this.deleteTrivCreator(id);
            }
            return <div className='qaAnsGroup'>
              <button className='btn-2' onClick={this.state.editElement === elemId ? submitBtn : editBtn}>
                {this.state.editElement === id ? 'Submit' : 'Edit'}</button>
              <button className='btn-2' onClick={deleteBtn}>Delete</button></div>
          }
        }
        let createSetPage = this.props.trivSwitch === 3
        let editing = this.state.editElement === elemId;
        let qaCards = (elem) => {
          let qaListCards = []
          if (elem.qaList && elem.qaList[0]) {
            console.log('HContentSet, TrivCard, qaCards, elem.qaList.length', elem.qaList.length)
            console.log('qaCards, elem', elem)
            for (let index = 0; index < elem.qaList.length; index++) {
              let qaGroup = elem.qaList[index];
              const { tempTrivQ, tempTrivQA1, tempTrivQA2, tempTrivQA3, tempTrivQA4, tempTrivId, tempTrivName } = this.state;
              let qaGroupArr = [qaGroup.qa_question, qaGroup.qa_ans1, qaGroup.qa_ans2, qaGroup.qa_ans3, qaGroup.qa_ans4]
              // for (let QSetIndex = 0; QSetIndex < elem.qaGroupArr.length; QSetIndex++) {
              //   let qaQCards = [];
              // if (qaGroup[0]) {
              // return (
              // <div className='qaAnsGroup'>
              //   <div className='qaAnsTitle'>Question:</div>
              //   <textarea key={QSetIndex} name={qaGroupArr} className={editing && tempTrivQ !== '' ? 'qaInputTextActive ' : 'qaInputText'} type="text" value={editing ? qaGroupArr[QSetIndex] : qaGroup.qa_question} onClick={this.handleSelect} />
              // </div>
              // )
              //   }
              // }
              qaListCards.push(
                <HQSet qaGroupArr={qaGroupArr}
                  tempTrivId={tempTrivId}
                  tempTrivName={tempTrivName}
                  tempTrivQ={tempTrivQ}
                  tempTrivQA1={tempTrivQA1}
                  tempTrivQA2={tempTrivQA2}
                  tempTrivQA3={tempTrivQA3}
                  tempTrivQA4={tempTrivQA4}
                  editing={editing} />
                // <div key={[elemId, index2]} className='trivCardWideMid' value={qaGroup} >

                // <div className='qaAnsGroup'>
                //   <div className='qaAnsTitle'>Question:</div>
                //   <textarea className={editing && tempTrivQ !== '' ? 'qaInputTextActive ' : 'qaInputText'} type="text" value={editing ? qaGroup : qaGroup.qa_question} onClick={this.handleSelect} />
                // </div>
                // <div className='qaAnsGroup'>
                //   <div className='qaAnsTitle'>Correct Answer:</div>
                //   <textarea className={editing && tempTrivQ !== '' ? 'qaInputTextActive ' : 'qaInputText'} type="text" value={editing ? qaGroup : qaGroup.qa_ans1} onClick={this.handleSelect} />
                // </div>
                // <div className='qaAnsGroup'>
                //   <div className='qaAnsTitle'>Incorrect Answer:</div>
                //   <textarea className={editing && tempTrivQ !== '' ? 'qaInputTextActive ' : 'qaInputText'} type="text" value={editing ? qaGroup : qaGroup.qa_ans2} onClick={this.handleSelect} />
                // </div>
                // <div className='qaAnsGroup'>
                //   <div className='qaAnsTitle'>Incorrect Answer:</div>
                //   <textarea className={editing && tempTrivQ !== '' ? 'qaInputTextActive ' : 'qaInputText'} type="text" value={editing ? qaGroup : qaGroup.qa_ans3} onClick={this.handleSelect} />
                // </div>
                // <div className='qaAnsGroup'>
                //   <div className='qaAnsTitle'>Incorrect Answer:</div>
                //   <textarea className={editing && tempTrivQ !== '' ? 'qaInputTextActive ' : 'qaInputText'} type="text" value={editing ? qaGroup : qaGroup.qa_ans4} onClick={this.handleSelect} />
                // </div>
                // </div>
              )
            }
            qaListCards.push(
              <div key='a' className='trivCardWideMid'>
                {editing ? <div className='qaAnsGroup'>
                  <button className='btn-2' onClick={() => { this.props.addSet(elemIndex) }}>Add Question</button></div>
                  : <></>}</div>
            )
          }
          return qaListCards;
        }
        return (<>
          {!createSetPage ? (
            <div key={elemId} className={'trivCard'}>
              <p className='align-left'><textarea className='inputTrivText' type="text" name='tempTrivName' value={elem.cat_name} onChange={this.handleChange} /></p>
              <div className='trivText'>{elem.qa_amount}{elem.qa_amount !== 1 ? ' questions' : ' question'}</div>
              {!editing ? <div className=''>{buttons(elemId, elemName)}</div> : <></>}
            </div>) : (<></>)
          } {
            createSetPage ? (<>
              <div className='trivCardWideTop'>
                <p className='align-left-wide'><textarea className='inputWideName' type="text" name='tempTrivName' value={editing ? this.state.tempTrivName : elem.cat_name} onChange={this.handleChange} /></p>
                <div className='trivAmountWide'>{elem.qa_amount}{elem.qa_amount !== 1 ? ' questions' : ' question'}</div>
              </div>
              <>{qaCards(elem)}</>
              <div key={elemId} className='trivCardWideBot'>
                <div className='tCWBtnBox'>
                  {editing || this.state.editElement === '' ? buttons(elemId, elemName) : <></>}
                </div>
              </div>
            </>) : (<></>)
          }
        </>)

      })
    }
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