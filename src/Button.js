import React, { Component } from 'react';
import './App.css'

class Button extends Component {
  render() {
    return (
      <button type="button" className="nbutton" onClick={() => {this.props.callback(this.props.image === "eighthbar" ? "barnote" : this.props.image)}}
	style={{backgroundColor: (this.props.selected === this.props.image ||
		this.props.selected === "barnote" && this.props.image === "eighthbar"
		? "skyblue" : "lightgrey"),
		backgroundImage: "url(" + require("./images/" + this.props.image + ".png") + ")",
		width: (this.props.size ? this.props.size+"vw" : "5vw"),
		height: (this.props.size ? this.props.size+"vw" : "5vw")
		}}>
	</button>
    );
  }
}

export default Button;
