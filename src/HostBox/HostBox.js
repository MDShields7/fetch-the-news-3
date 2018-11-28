import React, { Component } from 'react'
// import routes from '../routes';
import HNav from './HostNav/HostNav';
import {Switch, Route} from 'react-router-dom';
import HContent from './HContent/HContent'
import HSetup from './HSetup/HSetup'
import HLobby from './HLobby/HLobby'




export default class HostBox extends Component {
  constructor(props){
    super(props)
    this.state = {
  //     userList: [
  //        {id: 0, name: 'Jose', isReady: false, roundScore: 100, totalScore:500},
  //   {id: 1, name: 'Nathan', isReady:true, roundScore: 0, totalScore:400},
  //   {id: 2, name: 'Emilia', isReady: true, roundScore: 200, totalScore:100},
  //   {id: 3, name: 'Francois', isReady: false, roundScore: 0, totalScore:200},
  //   {id: 4, name: 'Xixi', isReady: true, roundScore: 0, totalScore:300},
  //   {id: 5, name: 'Jay', isReady: true, roundScore: 100, totalScore:300},
  //   {id: 6, name: 'Bill', isReady: true, roundScore: 100, totalScore:300},
  //   {id: 7, name: 'Juan', isReady: false, roundScore: 100, totalScore:400},
  // ],  
    }
    const {socket} = props
  }

  render() {
    const { userList } = this.state;
    return (
      <div>

        {console.log(this.props)}
        
        {/* <h4>HostBox</h4> */}
        <HNav/>

        <Switch>
        
          <Route exact path='/' component={HContent}/>
          <Route path='/setup' component={HSetup}/>
          <Route path='/lobby' render={() => {
            return <HLobby socket={this.props.socket}/>
          }}/>

        </Switch>
      </div>
    )
  }
}
