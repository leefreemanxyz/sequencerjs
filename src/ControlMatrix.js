import React, { PureComponent } from "react"
import uuid from "uuid/v4"
import SequencerTrack from "./SequencerTrack"
import PlaybackControls from "./PlaybackControls"
import * as Tone from "tone"
const synths = {}

export default class ControlMatrix extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      tracks: {},
      bpm: 120,
      playing: false,
      sequencePoint: 0
    }
    const notes = [
        "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
      ]
    // create loop
    // iterate over all synths in array
    // trigger note if true
    const loop = new Tone.Loop((time)=>{
        Object.keys(synths).forEach((trackUuid,index)=>{
            console.log(trackUuid)
            console.log(synths[trackUuid])
            synths[trackUuid].triggerAttackRelease(`${notes[index % 12]}3`, "16n", time)
        })
    }, "4n")
    loop.start()

  }
  componentWillMount() {
      Tone.Transport.start('+0.1')
  }
  addTrack = () => {
    let trackUuid = uuid()
    this.setState((prevState) => ({
      tracks: {
        ...prevState.tracks,
        [trackUuid]: { sequence: Array(16).fill(0) }
      }
    }))
    synths[trackUuid] = new Tone.Synth().toMaster()
    synths[trackUuid].triggerAttackRelease("D3", "16n")
  }
  removeTrack = (e) => {
    const { [e.target.id]: _, ...newState } = this.state.tracks
    this.setState({
      tracks: newState
    })
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
          uuid: uuid
        }
      }
    }))
  }
  startPlayback = () => {
    this.setState({
      playing: true
    })
  }
  stopPlayback = () => {
    this.setState({
      playing: false
    })
  }
  setTempo = (e) => {
    this.setState({
      bpm: e.target.value
    })
  }
  render() {
    return (
      <div>
        {Object.values(this.state.tracks).map((t, index) => {
          let uuid = Object.keys(this.state.tracks)[index]
          return (
            <SequencerTrack
              key={uuid}
              removeTrack={this.removeTrack}
              toggleNote={this.toggleNote}
              track={{ ...t, uuid }}
            />
          )
        })}
        <button onClick={this.addTrack}>+</button>
        <PlaybackControls
          startPlayback={this.startPlayback}
          stopPlayback={this.stopPlayback}
          setTempo={this.setTempo}
        />
      </div>
    )
  }
}
