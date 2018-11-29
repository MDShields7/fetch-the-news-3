import React, { Component } from 'react';
import {connect} from 'react-redux';
import { updateUser, updateUserList, updateTrivSwitch, updateNewsAllList, updateNewsMyList, updateNewsMyListCreated} from '../ducks/reducer';
import { withRouter } from 'react-router';
import UQA from './UQA'
import socketIOClient from 'socket.io-client';
//dvmtn
// var socket = socketIOClient("http://192.168.1.5:4001/"); 
//home
var socket = socketIOClient("http://192.168.0.34:4001/"); 
// var socket = socketIOClient();

class UserBox extends Component {
  constructor(props){
    super(props)
    this.state ={
      // user: {},
      userName: '',
      user: {},
      submitEntry: false,
      isReady: false,
      gamePhase: null
    }
    // RECEIVE WELCOME
    socket.on('welcome', (welcome) => {
      console.log('UserBox.js, receiving welcome', welcome);
      this.setState({user:welcome.user})
      this.props.updateUser(welcome.user)
      this.props.updateUserList(welcome.userList)
    })
    socket.on('name welcome', (userJoin) => {
      console.log('UserBox.js, receiving name welcome', userJoin);
      this.setState({user:userJoin.user})
      this.props.updateUser(userJoin.user)
      this.props.updateUserList(userJoin.userList)
    })
    socket.on('game phase two', (message) => {
      console.log('UserBox.js, receiving game phase', message);
      this.setState({gamePhase: message.gamePhase})
    })
  }
  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({[name]: value})
  }
  handleSubmit = () => {
    this.setState({
      submitEntry: true,
    })
    socket.emit('join user', {
      userId: this.props.user.userId,
      userName: this.state.userName,
    })
    console.log('UserBox join user', this.props.user, this.state.userName)
    // console.log(UserBox, submit, )
  }
  handleReady = () => {
    this.setState({
      isReady: !this.state.isReady,
    })
    // let newUser = {...this.state.user)
    // Object.assign(newUser, {'isReady': this.state.isReady})

    socket.emit('ready user', {
      isReady: !this.state.isReady
    })
    // console.log('sent ready user message')
  }

  render() {
    const { userName, userCheck, gameStart, gamePhase, submitEntry, isReady } = this.state;
    // console.log('----------- state', this.state)
    // console.log('----------- props', this.props)
    return (
      <div>
        <h1>User Box</h1>
        { gamePhase === null && this.props.userList.length >= 8 ? 
          <>
          <h2>Game is Full</h2> </>
          : gamePhase === null && !submitEntry ? <>
          <h2>Username:</h2>
          <input type="text" name={'userName'} value={userName} onChange={this.handleChange}/>
          {userCheck ?
            this.checkItemMsg() : <p></p>}
          <button onClick={this.handleSubmit}>Submit</button> </> 
          : gamePhase === null ? <>
          <h2>Ready?</h2>
          <button className={isReady ? 'ready-btn-on' : 'ready-btn-off'} onClick={this.handleReady}>Click when ready to play</button> </>
          : gamePhase === 1 ? <>
          <UQA/>
          </>
          : gamePhase === 2 ?<>
          <UQA/>
          </>
          : <>

          </>
        }
      </div>
    )
  }
}
function mapStateToProps( state ){
  const { user, userList, gameStart, gamePhase, trivSwitch, newsAllList, newsMyList, newsMyListCreated} = state;
  return {
    user,
    userList,
    gameStart,
    gamePhase, 
    trivSwitch,
    newsAllList,
    newsMyList,
    newsMyListCreated
  };
}
export default withRouter(connect (mapStateToProps, { updateUser, updateUserList, updateTrivSwitch, updateNewsAllList, updateNewsMyList,updateNewsMyListCreated})(UserBox)); 