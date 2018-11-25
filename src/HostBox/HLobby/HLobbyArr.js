import React, { Component } from 'react'
import {connect} from 'react-redux';
import { updateUserList } from '../../ducks/reducer';
import { withRouter } from 'react-router';

class HLobbyArr extends Component {
  constructor(){
    super()
    this.state = {
      reload: false
    }
  }
  componentDidUpdate = (prevProps) => {
    const {userList} = this.props
    if (prevProps.userList !== this.props.userList){
      console.log('reloading!!!!!!!!!!!!!!!')
      this.reloadSwitch()
    }
    setTimeout(this.reloadSwitch(), 500)
  }
  reloadSwitch = () => {
    this.setState({
      reload: !this.setState.reload
    })
  }

  render() {
    const {userList} = this.props
    const topArr = userList.map(elem => {
      if (!this.state.reload){
        if (elem['id'] % 2 === 0){
          return (
            <div className='player-box'>
          <div className={elem.isReady ? 'player-text-r': 'player-text'}>{elem.name}
          </div>
        </div>)
        }
      }
    })
    const botArr = userList.map(elem => {
      if (!this.state.reload){
        if (elem['id'] % 2 !== 0){
          return (
            <div className='player-box'>
          <div className={elem.isReady ? 'player-text-r': 'player-text'}>{elem.name}
          </div>
        </div>)
        }
      }
    })
    console.log('HLobbyArr, props', this.props)
    return (
      <>
        <div className='lobby-player-arr'>
            {topArr}
        </div>
        <div className='lobby-player-arr'>
            {botArr}
        </div>
      </>
    )
  }
}


function mapStateToProps( state ){
  const { userList } = state;
  return {
    userList
  };
}
export default withRouter(connect (mapStateToProps, { updateUserList })(HLobbyArr)); 