import React, { Component } from 'react';
import ClefMenu from './ClefMenu.js'
import TimeMenu from './TimeMenu.js'
import './App.css'

class Popup extends Component {
  render() {
    return (
      <div className="popup">
	<div className="popup_inner">
	  {this.props.type === "clef" ? <div>
	  <h2>Choose Clef</h2>
	  {this.props.begin ? <p style={{margin: "2vw", fontSize: "2vw"}}>It is found at the
		beginning of the song.</p> : <p/>}
	  <ClefMenu callback={this.props.callback}/></div> :
	  this.props.type === "time" ? <div>
	  <h2>Choose Time Signature</h2>
	  {this.props.begin ? <p style={{margin: "2vw", fontSize: "2vw"}}>Also found at the
		 beginning of the song.</p> : <p/>}
          <TimeMenu callback={this.props.callback}/></div> :
	  this.props.type === "intro" ? <div>
	  <h2>Welcome!</h2>
	  <p style={{margin: "2vw", fontSize: "2vw"}}>Click the button below when you are ready
		to put in the notes for your song.</p>
	  <button type="button" className="nbutton" style={{padding: "10px", float: "bottom"}}
		onClick={() => {this.props.callback()}}>I'm ready!</button></div> :
	  <p/>}
	</div>
      </div>
    );
  }
}

export default Popup;

