import React, { Component } from 'react';
import {connect} from 'react-redux';
import {updateMobileDevice} from './ducks/reducer';
import {isMobile} from 'react-device-detect';
import UBox from './UserBox/UserBox';
import HBox from './HostBox/HostBox';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
  }
  componentDidMount = () => {
    // console.log(isMobile)
    this.props.updateMobileDevice(isMobile)
  }
  propsBtn = () => {
    console.log(this.props);
  }
  render() {
    const viewType = () => {
      if (this.props.hasOwnProperty('mobileDevice') === false){
        return <h1>Loading</h1>
      } else if (this.props.mobileDevice === true){
        return <UBox /> //mobile devices given User component
      } else if (this.props.mobileDevice === false){
        return <HBox joinHostRequest={this.joinHostRequest}/> //desktop devices given Host component
      }
    }
    // console.log(this.props)
    return (
      <div className="App">
        {/* <div className='AppStuff'>
          <h4>App</h4>
          <div>mobile device: {String(this.props.mobileDevice)}</div>
          <button onClick={this.propsBtn}>Check App.js Props</button>
        </div> */}
        <div >{viewType()}</div>
      </div>
    );
  }
}
function mapStateToProps( state ){
  const {host, mobileDevice} = state;
  return {
      host,
      mobileDevice,
  };
}
export default connect (mapStateToProps, {updateMobileDevice})(App); 