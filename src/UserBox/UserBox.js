import React, { Component } from 'react';
import {connect} from 'react-redux';
import {updateTrivSwitch, updateNewsAllList, updateNewsMyList, updateNewsMyListCreated} from '../ducks/reducer';
import { withRouter } from 'react-router';
import socketIOClient from 'socket.io-client';
var socket = socketIOClient();

class UserBox extends Component {
  constructor(props){
    super(props)
    this.state = {}
    // RECEIVE WELCOME
    socket.on('welcome', (welcome) => {
      console.log('App.js, receiving welcome', welcome);
      // this.props.updateUserList(welcome.userList)
    })

    socket.emit('join user', {
      user: 1
    })
    socket.emit('ready user', {
      user: 2
    })
  }


  render() {
    console.log('----------- socket', socket)
    return (
      <div>
        <h1>User Box</h1>
      </div>
    )
  }
}
function mapStateToProps( state ){
  const {trivSwitch, newsAllList, newsMyList, newsMyListCreated} = state;
  return {
    trivSwitch,
    newsAllList,
    newsMyList,
    newsMyListCreated
  };
}
export default withRouter(connect (mapStateToProps, {updateTrivSwitch, updateNewsAllList, updateNewsMyList,updateNewsMyListCreated})(UserBox)); 