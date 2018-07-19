import React, { PureComponent } from "react"
import uuid from "uuid/v4"
import SequencerTrack from "./SequencerTrack"
import PlaybackControls from "./PlaybackControls"
import * as Tone from "tone"
import kitData from './kit.json'

let samples = kitData.data
const synths = {}
const volumes = {}

const sample = [
    {name:"Kick", url:"../808_drum_kit/kicks/808-Kicks01.wav"},
    {name:"Snare", url:"../808_drum_kit/snares/808-Clap01.wav"},    
]

export default class ControlMatrix extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      tracks: {},
      bpm: 120,
      playing: false,
      sequencePoint: 0,
      nextTrack: ""
    }
    const notes = [
        "C", "C#", 
        "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
      ]
    
    const loop = new Tone.Loop((time)=>{
        Object.keys(synths).forEach((trackUuid,index)=>{
            if(this.state.tracks[trackUuid] && this.state.tracks[trackUuid].sequence[(this.state.sequencePoint % 16)]){
            synths[trackUuid].start()
        }
        })
        Tone.Draw.schedule(()=>{
            this.setState({sequencePoint: this.state.sequencePoint + 1})
          })
    }, "16n")
    loop.start()

  }
  addTrack = () => {
    let trackUuid = uuid()
    this.setState((prevState) => ({
      tracks: {
        ...prevState.tracks,
        [trackUuid]: { sequence: Array(16).fill(0), uuid: trackUuid, name: samples[this.state.nextTrack].name }
      }
    }))
    volumes[trackUuid] = new Tone.Volume(0)
    synths[trackUuid] = new Tone.Player({url: samples[this.state.nextTrack].url, retrigger: true}).toMaster()
    synths[trackUuid].chain(volumes[trackUuid], Tone.Master)
  }
  removeTrack = (e) => {
    const { [e.target.id]: _, ...newState } = this.state.tracks
    console.log(newState)
    this.setState({
      tracks: newState
    })
  }
  changeTempo = (e) => {
    this.setState({
      bpm: e.target.value
    })
    Tone.Transport.bpm.rampTo(e.target.value, 4);
  }
  toggleNote = (e) => {
    let uuid = e.target.attributes.uuid.value
    let index = e.target.attributes.index.value
    let newVal = Number(e.target.attributes.val.value) ? 0 : 1
    this.setState((prevState) => ({
      tracks: {
        ...prevState.tracks,
        [uuid]: {
          sequence: [
            ...prevState.tracks[uuid].sequence.slice(0, Number(index)),
            newVal,
            ...prevState.tracks[uuid].sequence.slice(Number(index) + 1)
          ],
          uuid: uuid,
          name: prevState.tracks[uuid].name
        }
      }
    }))
  }
  startPlayback = () => {
    this.setState({
      playing: true
    })
    Tone.Transport.start('+0.1')

  }
  stopPlayback = () => {
    this.setState({
      playing: false
    })
    Tone.Transport.stop()
  }
  setTempo = (e) => {
    this.setState({
      bpm: e.target.value
    })
    Tone.Transport.bpm.rampTo(e.target.value, 4)
  }
  changeTrackVolume = (e) => {
      console.log(volumes[e.target.attributes.uuid.value])
      volumes[e.target.attributes.uuid.value].volume.rampTo(e.target.value, 0.05)
  }
  setChosenSample = (e) => {
      this.setState({
          nextTrack: e.target.value
      })
  }
  handleFileUpload = (e) => {
      samples = [].concat(samples, {url: URL.createObjectURL(e.target.files[0]), name: e.target.files[0].name})
      
      this.forceUpdate()
  }
  render() {
    return (
      <div>
          <table>
              <tbody>
{Object.values(this.state.tracks).map((t, index) => {
    let uuid = Object.keys(this.state.tracks)[index]
    return (
      <SequencerTrack
        key={uuid}
        removeTrack={this.removeTrack}
        toggleNote={this.toggleNote}
        changeTrackVolume={this.changeTrackVolume}
        track={{ ...t, uuid }}
      />
    )
  })}
              </tbody>
          </table>
        
        <select onChange={this.setChosenSample}>
            <option value=""></option>
            {samples.map((sample, index)=>{
                return <option key={index} value={index}>{sample.name}</option>
            })}
        </select>
        <button onClick={this.addTrack}>+</button>

        <input type="file" onChange={this.handleFileUpload}/>
        <PlaybackControls
          bpm={this.state.bpm}
          startPlayback={this.startPlayback}
          stopPlayback={this.stopPlayback}
          setTempo={this.setTempo}
        />
      </div>
    )
  }
}
