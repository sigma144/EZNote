import React, { Component } from 'react'
import './App.css'
import Button from './Button.js'
import Staff from './images/staff.png'
import Popup from './Popup.js'
import MIDISounds from 'midi-sounds-react'

class App extends Component {
  constructor() {
    super();
    this.state = {mx: 0, my: 0, x: 0, y: 0, nx: -100, ny: -100,
		  note: "quarter", speed: "100",
		  allnotes: [],
		  measure: 0,
		  notes: [],
		  intropop: true,
		  clefpop: true,
		  timepop: true,
		  begin: true,
		  playing: undefined,
		  bpm: 100,
		  speedmod: 0,
		  playcount: 0,
		  clef: "treble",
		  time: "44",
		  baseoffset: 110,
		  clefoffset: 0,
		  accoffset: [],
		  lastacc: undefined,
		  notepitch:
			{quarter: 0, eighth: 0, half: 0, barnote: 0,
                         quarterdot: 0, halfdot: 0, whole: -5},
		  noteduration:
			{quarter: 1, eighth: 0.5, half: 2, barnote: 0.5,
			 quarterdot: 1.5, halfdot: 3, whole: 4,
			 rquarter: 1, reighth: 0.5, rhalf: 2},
		  clefs: {treble: 0, bass: 12, treble8: 7},
		  accidentals: {flat: -1, sharp: 1, natural: 0}
	}
  }
  setSelectedNote = (selected) => {
    this.setState({note: selected})
  }
  setBPM = (BPM) => {
    this.setState({bpm: BPM})
  }
  setBPMEvent = (e) => {
    this.setBPM(e.target.value)
  }
  incBPM = () => { this.setBPM(this.state.bpm + 5); console.log("inc") }
  decBPM = () => { this.setBPM(this.state.bpm - 5) }
  startPlaying = () => {
    this.setMeasure(0);
    this.setState({speedmod: 60000 / this.state.bpm, playcount: this.state.playcount + 1},
	function () {this.playNote(0, this.state.playcount)})
  }
  stopPlaying = () => {
    this.setMeasure(0);
    this.setState({playing: undefined})
    this.midiSounds.cancelQueue()
  }
  playNote = (noteindex, playcount) => {
    if (playcount !== this.state.playcount) return
    if (noteindex + this.state.measure*25 >= this.state.allnotes.length) {
      this.stopPlaying()
      return
    }
    if (noteindex > 50) {
      this.setMeasure(this.state.measure+2)
      this.playNote(0, playcount)
      return
    }
    if ((noteindex) % 25 === 0 && this.state.accoffset.length > 0) {
      this.setState({accoffset: [], lastacc: undefined}, function() {
        this.playNote(noteindex, playcount)})
      return
    }
    let note = this.state.notes[noteindex]
    if (!note) {
      this.playNote(noteindex+1, playcount)
      return
    }
    if (this.isClef(note.note)) {
      this.setState({clefoffset: this.state.clefs[note.note]}, function () {
	this.playNote(noteindex+1, playcount)})
      return
    }
    if (this.isAcc(note.note)) {
      this.setState({lastacc: note.note}, function () {
        this.playNote(noteindex+1, playcount)})
      return
    }
    let duration = this.state.noteduration[note.note]
    if (!duration) {
      this.playNote(noteindex+1, playcount)
      return
    }
    this.setState({playing: note})
    this.midiSounds.cancelQueue()
    if (this.state.notepitch[note.note] !== undefined) {
      if (this.state.lastacc) {
	this.state.accoffset[note.y] = this.state.accidentals[this.state.lastacc]
	this.setState({lastacc: undefined})
      }
      let acc = this.state.accoffset[note.y]
      let notey = 4 + note.y + this.state.notepitch[note.note] + this.state.clefoffset
      let pitch = this.state.baseoffset - Math.round(notey * 12 / 7) + (acc ? acc : 0)
      this.midiSounds.playChordNow(3, [pitch], duration * this.state.speedmod / 1000)
    }
    setTimeout(function() {
	if (this.state.playing) this.playNote(noteindex+1, playcount)
    }.bind(this), duration * this.state.speedmod)
  }
  setClef = (selected) => {
    this.setState({clef: selected, clefpop: false, note: selected})
  }
  setTime = (selected) => {
    this.setState({time: selected, timepop: false, note: selected})
  }
  placeClef = (selected) => {
    this.setState({clefpop: false})
    this.state.notes[1] = {note:selected,x:1,y:22}
    this.forceUpdate()
  }
  placeTime = (selected) => {
    this.setState({timepop: false, begin: false})
    this.state.notes[3] = {note:selected,x:3,y:22}
    this.forceUpdate()
  }
  clearIntro = () => {
    this.setState({intropop: false})
  }
  saveMeasures() {
    for (let i = 0; i < 75; i++) {
      if (this.state.notes[i] !== undefined)
	this.state.notes[i].x = i + this.state.measure*25;
      this.state.allnotes[i + this.state.measure*25] = this.state.notes[i]
    }
  }
  loadMeasures() {
    for (let i = 0; i < 75; i++) {
      this.state.notes[i] = this.state.allnotes[i + this.state.measure*25]
      if (this.state.notes[i] !== undefined)
        this.state.notes[i].x = i;
    }
  }
  setMeasure(val) {
    this.saveMeasures()
    this.state.measure = val
    this.loadMeasures()
    this.forceUpdate()
  }
  incMeasure() {
    if (this.state.playing) this.stopPlaying()
    this.setMeasure(this.state.measure + 1)
  }
  decMeasure() {
    if (this.state.playing) this.stopPlaying()
    if (this.state.measure === 0) return
    this.setMeasure(this.state.measure - 1)
  }
  showClefPopup() {
    this.setState((prevState, props) => {return {clefpop: true}})
  }
  hideClefPopup() {
    this.setState((prevState, props) => {return {clefpop: false}})
  }
  showTimePopup() {
    this.setState((prevState, props) => {return {timepop: true}})
  }
  hideTimePopup() {
    this.setState((prevState, props) => {return {timepop: false}})
  }
  isAcc(note) {
    return note === "flat" || note === "sharp" || note === "natural"
  }
  isClef(note) {
    return note === "treble" || note === "bass" || note === "treble8"
  }
  isTime(note) {
    return note.length === 2
  }
  getNoteX = (note, x) => {
    if (x < 0) return -100
    return Math.round((x * 12 + 32) * window.innerWidth / 1000)
  }
  getNoteY = (note, y) => {
    return Math.round((y * 6.6 - (this.isAcc(note) ? 44 : 47)) * window.innerWidth / 1000 + 100)
  }
  rerender() {
    this.forceUpdate()
  }
  componentDidMount() {
    window.addEventListener("resize", this.rerender.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.rerender.bind(this));
  }
  _onMouseMove(e) {
    this.setState({ mx: Math.round(e.pageX / window.innerWidth * 1000),
		    my: Math.round((e.pageY - 70) / window.innerWidth * 1000),
		    x: Math.round((this.state.mx - 50) / 12),
		    y: (this.state.note[0] === "r" ? 23 :
			this.isTime(this.state.note) ||
			this.isClef(this.state.note) ? 22 :
			this.isAcc(this.state.note) ?
			Math.round(this.state.my / 6.6) + 4 :
			this.state.note === "whole" ?
                        Math.round(this.state.my / 6.6) + 5 :
			Math.round(this.state.my / 6.6)),
		    nx: (this.state.my < 20 || this.state.my > 220 ||
			 this.state.mx < 55 || this.state.mx > 940) ? -100 :
			this.getNoteX(this.state.note, this.state.x),
		    ny: (this.state.my < 20 || this.state.my > 220 ||
			 this.state.mx < 55 || this.state.mx > 940) ? -100 :
			this.getNoteY(this.state.note, this.state.y)
		})
  }
  _onMouseDown(e) {
    if (this.state.nx < 0 || this.state.ny < 0) return
    if (this.state.clefpop || this.state.timepop ||
	this.state.intropop) return
    if (this.state.playing) this.stopPlaying()
    let curNote = this.state.notes[this.state.x]
    if (this.state.note === "x") {
      this.state.notes[this.state.x] = undefined
    }
    else if (curNote === undefined || !(curNote.y === this.state.y &&
				   curNote.note === this.state.note)) {
      this.state.notes[this.state.x] =
	  {note:this.state.note, x:this.state.x, y:this.state.y}
    }
    else {
      this.state.notes[this.state.x] = undefined
    }
    this.forceUpdate()
  }
  getMarkerPosition() {
    return {
       left: this.state.playing ? this.getNoteX(this.state.playing, this.state.playing.x)+
	Math.round(5 * window.innerWidth / 1000)+"px" : "-101px",
	top: this.state.playing ? this.getNoteY(this.state.playing, this.state.playing.y)+
	Math.round(35 * window.innerWidth / 1000)+"px" : "-101px"
    }
  }
  renderNotes() {
    let notes = []
    let barnote = undefined
    for (let i = 0; i < this.state.notes.length; i++) {
      let note = this.state.notes[i]
      if (note === undefined) continue
      notes.push(<img className="note"
            src={require("./images/" + note.note + ".png")} alt=""
            style={{left: this.getNoteX(note.note, note.x) + "px",
                    top: this.getNoteY(note.note, note.y) + "px"}}/>)
      if (note.note === "barnote") {
        if (barnote === undefined) barnote = note
        else {
	  let bx1 = this.getNoteX(barnote.note, barnote.x) +
		Math.round(26 * window.innerWidth / 1000)
	  let bx2 = this.getNoteX(note.note, note.x) +
		Math.round(26 * window.innerWidth / 1000)
	  let by1 = this.getNoteY(barnote.note, barnote.y) +
		Math.round(5 * window.innerWidth / 1000)
          let by2 = this.getNoteY(note.note, note.y) +
		Math.round(5 * window.innerWidth / 1000);
	  let minx = Math.min(bx1, bx2)
	  let miny = Math.min(by1, by2)-Math.round(10 * window.innerWidth / 1000)
	  let dx = Math.abs(bx2 - bx1)
	  let dy = Math.abs(by2 - by1)+Math.round(20 * window.innerWidth / 1000)
	  notes.push(<svg width={dx} height={dy} style={{left: minx, top: miny}}>
		<line x1={bx1-minx} y1={by1-miny} x2={bx2-minx} y2={by2-miny}
		stroke="black" strokeWidth="0.5vw"/></svg>)
	  barnote = undefined
        }
      }
      else barnote = undefined
    }
    return notes
  }
  render() {
    return (
      <div className="App" onMouseMove={this._onMouseMove.bind(this)}
	onMouseDown={this._onMouseDown.bind(this)}>
	<MIDISounds className="midi" ref={(ref) => (this.midiSounds = ref)} appElementName="root" instruments={[3]} />
	<div id="body">
	  <p className="mnumber" style={{left: "5vw"}}>
	    {this.state.measure+1}</p>
	  <p className="mnumber" style={{left: "35vw"}}>
	    {this.state.measure+2}</p>
	  <p className="mnumber" style={{left: "65vw"}}>
	    {this.state.measure+3}</p>
	  <p className="mnumber" style={{left: "95vw"}}>
            {this.state.measure+4}</p>
	  <img id="staff" src={Staff} alt="" />
	  <button id="leftbutton" className="scrollButton" type="button"
	    onClick={this.decMeasure.bind(this)}>&#x25c4;</button>
	  <button id="rightbutton" className="scrollButton" type="button"
	    onClick={this.incMeasure.bind(this)}>&#x25ba;</button>
	  <img id="indicator"
	    src={require("./images/" + this.state.note + ".png")} alt=""
	    style={{left: this.state.nx + "px", top: this.state.ny + "px",
		    visibility: (this.state.note === "x" || this.state.clefpop ||
			this.state.timepop || this.state.intropop
			? "hidden" : "visible")}}/>
	  <p id="marker" style={this.getMarkerPosition()}>&#x25b2;</p>
	  {this.renderNotes()}
	  <div>
	    <div id="playback">
	      {this.state.playing === undefined ?
		<button className="playbutton" type="button" onClick={
		this.startPlaying.bind(this)} style={{backgroundColor:"forestgreen"}}>
		Play &#x25ba;</button> :
		<button className="playbutton" type="button" onClick={
		this.stopPlaying.bind(this)} style={{backgroundColor:"red"}}>
		Stop <span id="stop">&#x25a0;</span></button>}
	      <div>
		<br/>
	        <p style={{fontSize: "2vw"}}>Speed (bpm):</p>
	        <input id="speedinput" type="text" name="speed"
		defaultValue={this.state.bpm} onChange={ this.setBPMEvent }/>
		<br/>
	      </div>
	    </div>
	    <div id="notes">
	      <Button image="quarter" selected={this.state.note}
		callback={this.setSelectedNote}/>
              <Button image="eighth" selected={this.state.note}
		callback={this.setSelectedNote}/>
              <Button image="half" selected={this.state.note}
		callback={this.setSelectedNote}/>
	      <Button image="eighthbar" selected={this.state.note}
                callback={this.setSelectedNote}/>
	      <Button image="quarterdot" selected={this.state.note}
                callback={this.setSelectedNote}/>
	      <Button image="halfdot" selected={this.state.note}
                callback={this.setSelectedNote}/>
	      <Button image="whole" selected={this.state.note}
                callback={this.setSelectedNote}/>

	      <Button image="rquarter" selected={this.state.note}
                callback={this.setSelectedNote}/>
	      <Button image="reighth" selected={this.state.note}
                callback={this.setSelectedNote}/>
              <Button image="rhalf" selected={this.state.note}
                callback={this.setSelectedNote}/>
              <Button image="flat" selected={this.state.note}
                callback={this.setSelectedNote}/>
              <Button image="sharp" selected={this.state.note}
                callback={this.setSelectedNote}/>
	      <Button image="natural" selected={this.state.note}
                callback={this.setSelectedNote}/>
	      <Button image="x" selected={this.state.note}
                callback={this.setSelectedNote}/>
	    </div>
	    <div id="select">
              <Button image={this.state.clef} selected={this.state.note}
                callback={this.setSelectedNote} size="8"></Button>
              <Button image={this.state.time} selected={this.state.note}
                callback={this.setSelectedNote} size="8"></Button>
	      <button className="cbutton" type="button"
		onClick={this.showClefPopup.bind(this)}>Change</button>
	      <button className="cbutton" type="button"
		onClick={this.showTimePopup.bind(this)}>Change</button>
	      {this.state.timepop ? <Popup type="time" begin={this.state.begin}
                callback={this.state.begin ? this.placeTime : this.setTime}/> : null}
	      {this.state.clefpop ? <Popup type="clef" begin={this.state.begin}
		callback={this.state.begin ? this.placeClef : this.setClef}/> : null}
	      {this.state.intropop ? <Popup type="intro"
                callback={this.clearIntro}/> : null}
            </div>
	  </div>
	</div>
      </div>
    );
  }
}

export default App;
