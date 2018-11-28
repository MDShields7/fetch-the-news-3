import React, { Component } from 'react'
import {connect} from 'react-redux';
import { updateUserList } from '../../ducks/reducer';
import { withRouter } from 'react-router';

class HLobbyArr extends Component {
  constructor(props){
    super(props)
    // this.state = {
    //   userList: this.props.userList,
    // }
    const {socket} = this.props
  //   socket.on('user joined', (message) => {
  //     console.log('HostBox.js, receiving user join message', message.userList);
  //     // this.props.updateUserList(message.userList)
  //     this.setState({
  //       userList: message.userList
  //     })
  //   })
  //   socket.on('user readied', (message) => {
  //     console.log('---HLobbyArr.js, receiving user ready message',
  //     this.setState({
  //       userList: message.userList
  //     }))
  //   })
  // }
  // componentDidUpdate = (prevProps) => {
  //   const {userList} = this.props
  //   if (prevProps.userList !== this.props.userList){
  //     console.log('reloading!!!!!!!!!!!!!!!')
  //     this.reloadSwitch()
  //   }
  //   setTimeout(this.reloadSwitch(), 500)
  // }
  // reloadSwitch = () => {
  //   this.setState({
  //     reload: !this.setState.reload
  //   })
  }

  render() {
    // const {userList} = this.state
    const {userList,gameStart} = this.props
    console.log('HLobbyArr, props, userList', userList)
    // const topArr = userList.map(elem => {
    //   if (!this.state.reload){
    //     if (elem['id'] % 2 === 0){
    //       return (
    //         <div className='player-box'>
    //       <div className={elem.isReady ? 'player-text-r': 'player-text'}>{elem.name}
    //       </div>
    //     </div>)
    //     }
    //   }
    // })
    // const botArr = userList.map(elem => {
    //   if (!this.state.reload){
    //     if (elem['id'] % 2 !== 0){
    //       return (
    //         <div className='player-box'>
    //       <div className={elem.isReady ? 'player-text-r': 'player-text'}>{elem.name}
    //       </div>
    //     </div>)
    //     }
    //   }
    // })

    console.log('HLobbyArr, props', this.props)
    return (
      //Lobby version
      // <div className={ gameStart ? 'lobby-footer-2' : 'lobby-footer'}>
      <div className={'lobby-footer-sml'}>
        <div className='lobby-player-arr'>
          {userList ? userList.map(elem => {
            return (
              <div className='player-box'>
                <div className={elem.isReady ? 'player-text-r': 'player-text'}>{elem.userName}</div>
              </div>)
            })
          // Game version
          : <div className='no-userList'></div>
          }
        </div>
      </div>

    )
  }
}


function mapStateToProps( state ){
  const { userList, gameStart } = state;
  return {
    userList,
    gameStart
  };
}
export default withRouter(connect (mapStateToProps, { updateUserList })(HLobbyArr)); 
