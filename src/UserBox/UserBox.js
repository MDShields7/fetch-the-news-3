import React, { Component } from 'react';
import {connect} from 'react-redux';
import {updateTrivSwitch, updateNewsAllList, updateNewsMyList, updateNewsMyListCreated} from '../ducks/reducer';
import { withRouter } from 'react-router';
import socketIOClient from 'socket.io-client';
// var socket = socketIOClient("http://192.168.1.5:4000/")

class UserBox extends Component {
  constructor(props){
    super(props);
    this.state ={
      user: {}
    }
  
    // socket.emit('join user', {
    //   user: this.state.user.toLowerCase(),
    // })
    // socket.emit('ready user', {
    //   user: this.state.user.toLowerCase(),
    // })

  }

  render() {
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