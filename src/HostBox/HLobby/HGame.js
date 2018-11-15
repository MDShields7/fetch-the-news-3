import React, { Component } from 'react'

export default class HGame extends Component {
  constructor (props){
    super (props)
    this.state = {
      playerArr: [
        {id: 0, name: 'Jose', isReady: false},
        {id: 1, name: 'Nathan', isReady:true},
        {id: 2, name: 'Emilia', isReady: true},
        {id: 3, name: 'Francois', isReady: false},
        {id: 4, name: 'Xixi', isReady: true},
        {id: 5, name: 'Jay', isReady: true},
        {id: 6, name: 'Bill', isReady: true},
        {id: 7, name: 'Juan', isReady: false},
      ]
    }

  }
  render() {
    const {playerArr} = this.state;
  //   const gameArr = playerArr.map(elem => {
  //     return (
  //     <div className='player-box-sml'>
  //       <div className='player-text-sml'>{elem.name}
  //       </div>
  //     </div>)
  // })
  
  const topArr = playerArr.map(elem => {
    if (elem['id'] % 2 === 0){
      return (
      <div className='player-box-sml'>
      <div className={elem.isReady ? 'player-text-r': 'player-text-sml'}>{elem.name}
      </div>
    </div>)
    }
  })
  const botArr = playerArr.map(elem => {
    if (elem['id'] % 2 !== 0){
      return (
      <div className='player-box'>
      <div className={elem.isReady ? 'player-text-r': 'player-text-sml'}>{elem.name}
      </div>
    </div>)
    }
  })
    return (
      <div className='lobby-footer-sml'>
        {/* <div className='lobby-player-arr'>
            {gameArr}
        </div> */}
        <div className='lobby-player-arr'>
            {topArr}
        </div>
        <div className='lobby-player-arr'>
            {botArr}
        </div>
      </div>
    )
  }
}
