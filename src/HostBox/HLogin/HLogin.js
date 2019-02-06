import React, { Component } from 'react'
import { connect } from "react-redux";
import { updateHost, updateReg, updateLogin, updateUser } from "../../ducks/reducer";
import { withRouter } from 'react-router';
import axios from 'axios';
import * as Lib from '../../Library/Library';

export class HLogin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userList: [],
      regErrorMessage: '',
      loginUser: this.props.login.loginUser,
      loginPassword: this.props.login.loginPassword,
      regUser: this.props.reg.regUser,
      regEmail: this.props.reg.regEmail,
      regPassword: this.props.reg.regPassword,
    }
  }
  checkRegisterUser = async () => {
    const regUserMin = 6;
    const regEmailMin = 6;
    const regPasswordMin = 8;
    const regUserMax = 50;
    const regEmailMax = 100;
    const regPasswordMax = 50;
    await axios.get('/api/getUsers')
      .then(res => {
        console.log('res', res)
        console.log('res.data', res.data)
        this.setState({
          userList: res.data
        })
      })
      .catch(err => console.log('error at get userList', err))
    console.log('HLogin.js, handleRegChange, this.props', this.props)
    const empty = Lib.fieldsNotEmpty(this.props.reg.regUser, this.props.reg.regEmail, this.props.reg.regPassword);
    const min = Lib.fieldsCharsMin(regUserMin, this.props.reg.regUser, regEmailMin, this.props.reg.regEmail, regPasswordMin, this.props.reg.regPassword);
    const max = Lib.fieldsCharsMax(regUserMax, this.props.reg.regUser, regEmailMax, this.props.reg.regEmail, regPasswordMax, this.props.reg.regPassword);
    const emailValid = Lib.fieldsIsEmail(this.props.reg.regEmail);
    const entryNotUsed = Lib.checkListEntryNotUsed(this.state.userList, 'user_name', this.props.reg.regUser, 'user_mail', this.props.reg.regEmail);

    if (empty !== true) {
      console.log('Register error:', empty)
      this.setState({ regErrorMessage: empty })
    } else if (min !== true) {
      console.log('Register error:', min)
      this.setState({ regErrorMessage: min })
    } else if (max !== true) {
      console.log('Register error:', max)
      this.setState({ regErrorMessage: max })
    } else if (emailValid !== true) {
      console.log('Register error:', emailValid)
      this.setState({ regErrorMessage: emailValid })
    } else if (entryNotUsed !== true) {
      console.log('Register error:', entryNotUsed)
      this.setState({ regErrorMessage: entryNotUsed })
    }
  }
  register = async () => {
    await this.setState({ regErrorMessage: '' })
    await this.checkRegisterUser()
    console.log('HLogin.js, about to register User')
    console.log('HLogin.js, state', this.state.regErrorMessage)
    if (this.state.regErrorMessage === '') {
      axios.post('/api/registerUser', {
        user_name: this.props.reg.regUser,
        user_email: this.props.reg.regEmail,
        user_password: this.props.reg.regPassword
      }).then(response => {
        console.log('HLogin.js, register user complete:', response)
      }).catch(error => {
        console.log('HLogin.js, register user fail:', error)
      });
    }
  }
  checkLoginUser = () => {
    const loginUserMin = 6;
    const loginPasswordMin = 8;
    const regUserMax = 50;
    const regPasswordMax = 50;
    const empty = Lib.fieldsNotEmpty(this.props.login.loginUser, this.props.login.loginEmail, this.props.login.loginPassword);
    const min = Lib.fieldsCharsMin(loginUserMin, this.props.login.loginUser, loginPasswordMin, this.props.login.loginPassword);
    const max = Lib.fieldsCharsMax(regUserMax, this.props.login.loginUser, regPasswordMax, this.props.login.loginPassword);
  }
  login = () => {
    axios.post('/api/login', {
      user_name: this.props.login.loginUser,
      user_password: this.props.login.loginPassword
    })
      .then(response => {
        console.log('HLogin, login, post response', response)
        this.props.updateHost({ userId: response.data.user.user_id, userName: response.data.user.user_name })
        this.props.history.push("/")
      }).catch(error => {
        console.log('Error in login', error)
      });
  };
  logout = () => {
    axios.post('/api/logout').then(response => {
      console.log('HLogin, logout, post response', response)
      this.props.updateHost(null)
    }).catch(error => {
      console.log('Error in logout', error)
      // this.setState({ message: 'Something went wrong: ' + this.getMessage(error) });
    });
  };

  handleRegChange = async (e) => {
    const name = e.target.name
    const value = e.target.value
    let newReg = Object.assign(this.props.reg, { [name]: value });
    await this.props.updateReg(newReg)
    // await this.props.updateReg({ [name]: value })
    console.log('HLogin, handleRegChange, newReg', newReg)
    console.log('HLogin.js, this.props:', this.props)
    console.log('HLogin.js, this.state:', this.state)
  }
  handleLogin = async (e) => {
    const name = e.target.name
    const value = e.target.value
    let newLogin = Object.assign(this.props.login, { [name]: value });
    console.log('HLogin, handleChange, newLogin', newLogin)
    await this.props.updateLogin(newLogin)
  }

  render() {
    console.log('this.state:', this.state)
    console.log('this.props:', this.props)
    let input = (variable, text, fnType) => {
      return (<>
        <p>{text}</p>
        <input className='login-input' type="text" name={variable} placeholder={text} onChange={this[fnType]}></input> </>
      )
    }

    return (
      <div className='HLogin' >
        {this.props.host === null ? <>
          <section className='login-group'>
            <h2>Login</h2>
            <h4>Login as user:testuser, password:testuser in order to see a user with content</h4>
            {input('loginUser', 'Username', 'handleLogin')}
            {input('loginPassword', 'Password', 'handleLogin')}
            <button className='btn-3' onClick={this.login}>Submit</button>
          </section>
          <section className='login-group'>
            <h2>Register</h2>
            {input('regUser', 'Username', 'handleRegChange')}
            {input('regEmail', 'Email', 'handleRegChange')}
            {input('regPassword', 'Password', 'handleRegChange')}
            <button className='btn-3' onClick={this.register}>Submit</button>
          </section> </>
          : <section className='login-group'>
            <h2>Logout</h2>
            <button className='btn-3' onClick={this.logout}>Logout</button>
          </section>}
        {this.state.regErrorMessage ?
          <section>
            <h2>Error</h2>
            <p>{this.state.regErrorMessage}</p>
          </section >
          : <></>}
      </div >
    )
  }
}

function mapStateToProps(state) {
  const { reg, login, host } = state;
  return {
    reg,
    login,
    host
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    { updateHost, updateReg, updateLogin, updateUser }
  )(HLogin)
);