import React, { Component } from 'react'

export default class HQSet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tempTrivQ: this.props.tempTrivQ,
      tempTrivQA1: this.props.tempTrivQA1,
      tempTrivQA2: this.props.tempTrivQA2,
      tempTrivQA3: this.props.tempTrivQA3,
      tempTrivQA4: this.props.tempTrivQA4,
      TrivCard: []
    }
    // this.props.qaGroupArr
    // this.props.editing
  }
  componentDidMount = () => {
    if (this.state.tempTrivQ !== '') {
      this.arrayQSet();
    }
  }
  componentDidUpdate = (prevProps) => {
    if (this.props.tempTrivQ !== prevProps.tempTrivQ ||
      this.props.tempTrivQA1 !== prevProps.tempTrivQA1 ||
      this.props.tempTrivQA2 !== prevProps.tempTrivQA2 ||
      this.props.tempTrivQA3 !== prevProps.tempTrivQA3 ||
      this.props.tempTrivQA4 !== prevProps.tempTrivQA4
    ) {
      this.arrayQSet();
    }
  }
  handleSelect = (e) => {
    console.log('handleSelect working!, e.target.value', e.target.value)
    let { qa_question, qa_ans1, qa_ans2, qa_ans3, qa_ans4 } = e.target.value;
    this.setState({
      tempTrivQ: qa_question,
      tempTrivQA1: qa_ans1,
      tempTrivQA2: qa_ans2,
      tempTrivQA3: qa_ans3,
      tempTrivQA4: qa_ans4
    })
  }
  arrayQSet = () => {
    const { editing } = this.props
    const { tempTrivQ, tempTrivA1, tempTrivA2, tempTrivA3, tempTrivA4 } = this.state;
    let qaQCards = [];
    for (let QSetIndex = 0; QSetIndex < this.props.qaGroupArr.length; QSetIndex++) {
      qaQCards.push(
        <div className='qaAnsGroup'>
          <div className='qaAnsTitle'>Question:</div>
          <textarea className={editing && tempTrivQ !== '' ? 'qaInputTextActive ' : 'qaInputText'} type="text" value={editing ? '?' : 'ok'} />
        </div>
      )
      return (
        <div key={['elemId', QSetIndex]} className='TrivCardWideMid' value={'qaGroup'} onClick={this.handleSelect} >
          {qaQCards()}
        </div>
      )
    }
  }
  render() {

    return (
      <div>
      </div>
    )
  }
}
