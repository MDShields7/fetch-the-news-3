import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import {
  updateGameStart,
  updateGameEnd,
  updateRndCurrent,
  updateGamePhase,
  updateGameTimer
} from "../../ducks/reducer";
import genericUser from "../../Images/genericUser.svg"
import { withRouter } from "react-router";

// import './HostNav.css'

class HostNav extends Component {
  exitGame = () => {
    this.props.updateGameStart(false);
    this.props.updateGameEnd(false);
    this.props.updateRndCurrent(null);
    this.props.updateGamePhase(0);
    this.props.updateGameTimer(0);
  };
  render() {
    // console.log('HostNav, props', this.props.newsPlayingList)
    return (
      <div className="HostNav">
        {window.location.pathname === "/lobby" ? (
          <div className="NavGroup2">
            <div className="NavItem2">
              <NavLink onClick={this.exitGame} to="/">
                EXIT
              </NavLink>
              {/* <div>Other Nav bar</div> */}
            </div>
            <div className="NavItem2">
              <div>Category: {this.props.newsPlayingList.cat_name}</div>
            </div>
            <div className="NavItem2">
              <div>{this.props.rndLimit} rounds</div>
            </div>
            <div className="NavItem2">{this.props.gameTimer}</div>
          </div>
        ) : (
            <div className="NavGroup">
              {/* <div className='NavGroup2'> */}
              <div className="NavItem">Logo</div>
              <div className="NavLink">
                <div className="NavItem">
                  <NavLink to="/">Content</NavLink>
                </div>
                <div className="NavItem">
                  <NavLink to="/setup">Play Game</NavLink>
                </div>
                {this.props.host ?
                  <NavLink to="/login"><img src={genericUser} alt="generic user image" /></NavLink>
                  : <div className="NavItem">
                    <NavLink to="/login">Login</NavLink>
                  </div>}
              </div>
            </div>
          )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { host, gameStart, gameEnd, newsPlayingList, rndLimit, gameTimer } = state;
  return {
    host,
    gameStart,
    gameEnd,
    newsPlayingList,
    rndLimit,
    gameTimer
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    {
      updateGameStart,
      updateGameEnd,
      updateRndCurrent,
      updateGamePhase,
      updateGameTimer
    }
  )(HostNav)
);
