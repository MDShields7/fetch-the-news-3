import React, { Component } from 'react'
import routes from '../routes';
import HNav from './HostNav/HostNav';
// import socketIOClient from 'socket.io-client';

// const socket = socketIOClient();

export default class HostBox extends Component {
  render() {
    return (
      <div>
        
        {/* <h4>HostBox</h4> */}
        <HNav/>
        {routes}
      </div>
    )
  }
}
