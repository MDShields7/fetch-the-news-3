import React, { Component } from 'react'
import HNav from './HostNav/HostNav';
import axios from 'axios';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { updateNewsAllList, updateNewsMyList, updateNewsMyListCreated } from '../ducks/reducer';
import HContent from './HContent/HContent'
import HSetup from './HSetup/HSetup'
import HLobby from './HLobby/HLobby'
import HLogin from './HLogin/HLogin'

class HostBox extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    // const { socket } = props
    this.getTriviaSet();
    this.getMyTriviaSet();
    this.getMyTriviaCreated();
  }
  getTriviaSet = () => {
    console.log('getTriviaSet')
    axios.get('/api/TrivSet').then(res => {
      this.props.updateNewsAllList(res.data)
      this.setState({
        trivSwitch: 1,
        trivSetToMap: this.props.newsAllList
      })
    })
      .catch(err => console.log('error at get TriviaSet', err))

  }
  getMyTriviaSet = () => {
    if (this.props.host && this.props.host.userId) {
      console.log('getMyTriviaSet')
      axios.get('/api/MyTrivSet', { params: { userId: this.props.host.userId } }).then(res => {
        this.props.updateNewsMyList(res.data)
      })
        .catch(err => console.log('error at get TriviaSet', err))
    }
  }
  getMyTriviaCreated = () => {
    if (this.props.host && this.props.host.userId) {
      console.log('getTriviaSetCreated')
      axios.get('/api/MyTrivSetCreated', { params: { userId: this.props.host.userId } })
        .then(res => {
          this.props.updateNewsMyListCreated(res.data)
        })
        .catch(err => console.log('error at get TriviaSet', err))
    }
  }

  render() {
    const { userList } = this.state;
    return (
      <>

        {console.log(this.props)}

        {/* <h4>HostBox</h4> */}
        <HNav />

        <Switch>

          <Route exact path='/' component={HContent} />
          <Route path='/setup' component={HSetup} />
          <Route path='/login' component={HLogin} />
          <Route path='/lobby' render={() => {
            return <HLobby socket={this.props.socket} />
          }} />

        </Switch>
      </>
    )
  }
}
function mapStateToProps(state) {
  const { id, newsAllList, newsMyList, newsMyListCreated } = state;
  return {
    id,
    newsAllList,
    newsMyList,
    newsMyListCreated
  };
}
export default withRouter(connect(mapStateToProps, { updateNewsAllList, updateNewsMyList, updateNewsMyListCreated })(HostBox)); 