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
import { withRouter } from "react-router";
import Logo from '../../Images/ftn-logo-white.svg'
import Slogan from '../../Images/ftn-slogan-white.svg'

class HostNav extends Component {
  exitGame = () => {
    this.props.updateGameStart(false);
    this.props.updateGameEnd(false);
    this.props.updateRndCurrent(null);
    this.props.updateGamePhase(0);
    this.props.updateGameTimer(0);
  };
  render() {
    return (
      <div className="hostNav">
        {window.location.pathname === "/lobby" ? (
          <div className="navGroup2">
            <div className="navItem2">
              <NavLink onClick={this.exitGame} to="/">
                EXIT
              </NavLink>
              {/* <div>Other Nav bar</div> */}
            </div>
            <div className="navItem2">
              <div>Category: {this.props.newsPlayingList.cat_name}</div>
            </div>
            <div className="navItem2">
              <div>{this.props.rndLimit} rounds</div>
            </div>
            <div className="navItem2">{this.props.gameTimer}</div>
          </div>
        ) : (
            <div className="navGroup">
              <NavLink to="/"><img className='profile' src={Slogan} alt="" /></NavLink>
              <div className="navItem" ><NavLink to="/setup">Play Game</NavLink></div>
              {this.props.host ?
                <NavLink to="/login"><img className='profile' src={Logo} alt="user logged in graphic" /></NavLink>
                : <div className="navItem" ><NavLink to="/login">Login</NavLink></div>}
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
