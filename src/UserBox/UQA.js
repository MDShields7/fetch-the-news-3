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
    if (ansKeyRandom[e.target.name] === true) {
      await this.props.updateUser({ ...user, roundScore: 100 });
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
            className="b-Card-1"
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
            className={ansKeyRandom[index] ? "b-Card-true" : "b-Card-false"}
            onClick={this.checkAns}
          >
            <div className="b-Card-text">{elem}</div>
          </div>
        );
      })
    ) : (
        <div />
      );
    return { qaPlayingCurrent } ? (
      <div className="hQA-User-Box">
        <div className="q-Box">
          <div className="b-Box">{gamePhase === 1 ? BCard : <></>}</div>
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
