import React, { Component } from 'react';
import {Route, HashRouter} from "react-router-dom"
import './App.css';
import App from './App.js'
import Logo from './images/logo.png'

class Main extends Component {
  render() {
    return (
      <HashRouter>
	<div>
	  <header>
            <img id="logo" src={Logo} alt="EZNote" />
            <p id="intro">Hear what your music sounds like!</p>
          </header>
	  <Route exact path="/" component={App}/>
	</div>
      </HashRouter>
    );
  }
}

export default Main;
