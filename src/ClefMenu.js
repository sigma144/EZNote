import React, { Component } from 'react';
import Button from './Button.js'
import './App.css'

class ClefMenu extends Component {
  render() {
    return (
      <div id="selectclef">
	<Button image="treble" size="8" callback={this.props.callback}/>
	<Button image="bass" size="8" callback={this.props.callback}/>
	<Button image="treble8" size="8" callback={this.props.callback}/>
      </div>
    );
  }
}

export default ClefMenu;
