import React, { Component } from 'react'
import routes from '../routes';
import HNav from './HostNav/HostNav';



export default class HostBox extends Component {
  constructor(){
    super()
    

  }
  // componentDidUpdate = (prevprops) => {
  //   if (prevprops.userList !== this.props.userList) {
  //   }
  // }
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
