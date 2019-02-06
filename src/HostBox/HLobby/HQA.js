import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

class HQA extends Component {
  render() {
    console.log(
      "HQA, this.props.qaPlayingCurrent",
      this.props.qaPlayingCurrent
    );
    const { qaPlayingCurrent, gamePhase } = this.props;
    const { ansRandom } = this.props.qaPlayingCurrent.list;
    const { ansKeyRandom } = this.props.qaPlayingCurrent.list;
    let ACard = ansRandom[3] ? (
      ansRandom.map(elem => {
        let index = ansRandom.indexOf(elem);
        return (
          <div key={index} className="a-Card-1">
            <div className="a-Card-text">{elem}</div>
          </div>
        );
      })
    ) : (
        <div />
      );
    let ACardAnswer = ansRandom[3] ? (
      ansRandom.map(elem => {
        let index = ansRandom.indexOf(elem);
        return (
          <div
            key={index}
            className={ansKeyRandom[index] ? "a-Card-true" : "a-Card-false"}
          >
            <div className="a-Card-text">{elem}</div>
          </div>
        );
      })
    ) : (
        <div />
      );
    return (
      <div className="hQA-Box">
        <div className="q-Box">
          <div className="q-text">{qaPlayingCurrent.question}</div>
          <div className="a-Box">
            {gamePhase === 1 ? ACard : gamePhase === 2 ? ACardAnswer : <div />}
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const {
    id,
    userList,
    gamePhase,
    qaPlayingList,
    qaPlayingCurrent,
    newsPlayedList
  } = state;
  return {
    id,
    userList,
    gamePhase,
    qaPlayingList,
    qaPlayingCurrent,
    newsPlayedList
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(HQA)
);
