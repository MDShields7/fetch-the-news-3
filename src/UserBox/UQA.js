import React, { Component } from "react";
import { connect } from "react-redux";
import { updateUser, updateUserList } from "../ducks/reducer";
import { withRouter } from "react-router";

export class UQA extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  checkAns = async e => {
    const { ansKeyRandom } = this.props.qaPlayingCurrent.list;
    const { user } = this.props;
    console.log("UQA, checkAns, e.target", e.target);
    console.log("UQA, checkAns, e.target.name", e.target.name);
    if (ansKeyRandom[e.target.name] === true) {
      console.log('YAY, answer correct')
      console.log('USER RAW DATA', user)
      await this.props.updateUser({ ...user, roundScore: 100 });
      console.log('USER UPDATE DATA W/ SCORE', this.props.user)
      this.props.socket.emit("roundScore to server", { user: this.props.user });
    }
  };
  render() {
    const { qaPlayingCurrent, gamePhase, socket, user } = this.props;
    const { ansRandom } = this.props.qaPlayingCurrent.list;
    const { ansKeyRandom } = this.props.qaPlayingCurrent.list;

    let BCard = ansRandom[3] ? (
      ansRandom.map(elem => {
        let index = ansRandom.indexOf(elem);
        return (
          <button
            key={index}
            name={index}
            className="B-Card-1"
            onClick={this.checkAns}
          >{elem}
          </button>
        );
      })
    ) : (
        <div />
      );
    let BCardAnswer = ansRandom[3] ? (
      ansRandom.map(elem => {
        let index = ansRandom.indexOf(elem);
        return (
          <div
            key={index}
            className={ansKeyRandom[index] ? "B-Card-true" : "B-Card-false"}
            onClick={this.checkAns}
          >
            <div className="B-Card-text">{elem}</div>
          </div>
        );
      })
    ) : (
        <div />
      );
    return { qaPlayingCurrent } ? (
      <div className="HQA-User-Box">
        <div className="Q-Box">
          <div className="B-Box">{gamePhase === 1 ? BCard : <></>}</div>
        </div>
      </div>
    ) : (
        <></>
      );
  }
}
function mapStateToProps(state) {
  const { user, userList } = state;
  return {
    user,
    userList
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    {
      updateUser,
      updateUserList
    }
  )(UQA)
);
