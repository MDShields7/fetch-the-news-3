import React from 'react';
import {Switch, Route} from 'react-router-dom';
import HContent from './HostBox/HContent/HContent'
import HSetup from './HostBox/HSetup/HSetup'
import HParty from './HostBox/HParty/HParty'

export default (
    <Switch>
        
        <Route exact path='/' component={HContent}/>
        <Route path='/setup' component={HSetup}/>
        <Route path='/lobby' component={HParty}/>

    </Switch>
)