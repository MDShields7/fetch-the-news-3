import React, { Component } from 'react'
import {NavLink} from 'react-router-dom';
import '../../WithRouter'
// import './HostNav.css'

export default class HostNav extends Component {
  render() {
    return (
      <div className='HostNav'>
        {/* <withRouter/> */}
        <div className='NavGroup'>
          {/* <div className='NavGroup2'> */}
            <div className="NavItem">Logo</div>
            <div className="NavLink">
              <div className="NavItem">
                  <NavLink to='/'>Content</NavLink>
              </div>
              <div className="NavItem">
                  <NavLink to='/setup'>Setup</NavLink>
              </div>
              <div className="NavItem">
                  <NavLink to='/lobby'>Lobby</NavLink>
              </div>
            </div>
          {/* </div>   */}
        </div>  
      </div>
    )
  }
}
