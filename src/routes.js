import React from 'react';
import {Switch, Route} from 'react-router-dom';
import HContent from './HostBox/HContent/HContent'
import HSetup from './HostBox/HSetup/HSetup'
import HLobby from './HostBox/HLobby/HLobby'

export default (
    <Switch>
        
        <Route exact path='/' component={HContent}/>
        <Route path='/setup' component={HSetup}/>
        <Route path='/lobby' component={HLobby}/>

    </Switch>
)