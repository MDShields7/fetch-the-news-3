import React, { Component } from "react";
import { connect } from "react-redux";
import { updateMobileDevice } from "./ducks/reducer";
import { isMobile } from "react-device-detect";
import { withRouter } from "react-router";
import axios from 'axios';
import UBox from "./UserBox/UserBox";
import HBox from "./HostBox/HostBox";
import "./App.scss";

import socketIOClient from "socket.io-client";
var socket = socketIOClient(); // PRODUCTION BUILD, DIGITAL OCEAN
// var socket = socketIOClient("http://127.0.0.1:4000/"); // TESTING MODE, LAPTOP

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount = () => {
    this.props.updateMobileDevice(isMobile);
  };
  propsBtn = () => {
    console.log(this.props);
  };

  render() {
    const viewType = () => {
      if (this.props.hasOwnProperty("mobileDevice") === false) {
        return <h1>Loading</h1>;
      } else if (this.props.mobileDevice === true) {
        //mobile devices given User component
        return <UBox socket={socket} />;
      } else if (this.props.mobileDevice === false) {
        //desktop devices given Host component
        return <HBox socket={socket} joinHostRequest={this.joinHostRequest} />;
      }
    };
    return (
      <div className="app">
        {viewType()}
      </div>
    );
  }
}
function mapStateToProps(state) {
  const { mobileDevice } = state;
  return {
    mobileDevice,
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    { updateMobileDevice }
  )(App)
);
