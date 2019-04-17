import React, { Component } from 'react';
import Button from './Button.js'
import './App.css'

class TimeMenu extends Component {
  render() {
    return (
      <div id="selecttime">
	<Button image="cm" size="6" callback={this.props.callback}/>
        <Button image="24" size="6" callback={this.props.callback}/>
        <Button image="34" size="6" callback={this.props.callback}/>
        <Button image="44" size="6" callback={this.props.callback}/>
	<Button image="54" size="6" callback={this.props.callback}/>
	<Button image="74" size="6" callback={this.props.callback}/>

	<Button image="ct" size="6" callback={this.props.callback}/>
        <Button image="58" size="6" callback={this.props.callback}/>
        <Button image="68" size="6" callback={this.props.callback}/>
        <Button image="78" size="6" callback={this.props.callback}/>
        <Button image="98" size="6" callback={this.props.callback}/>
        <Button image="08" size="6" callback={this.props.callback}/>
      </div>
    );
  }
}

export default TimeMenu;
