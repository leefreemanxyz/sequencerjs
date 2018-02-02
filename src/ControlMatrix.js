import React, { PureComponent } from "react"
import uuid from 'uuid/v4'
import SequencerTrack from './SequencerTrack'
import PlaybackControls from './PlaybackControls'
import * as Tone from 'tone'
const synth = {}

export default class ControlMatrix extends PureComponent {
    constructor(props){
        super(props)

        this.state = {
            tracks: {},
            bpm: 120,
            playing: false
                    
        }
    }
    componentWillMount(){

    }
    addTrack = () => {
        let trackUuid = uuid()
        this.setState((prevState)=>({
            tracks: {...prevState.tracks, [trackUuid]:{sequence: Array(16).fill(0)}}
        })    
    )
    synth[trackUuid] = new Tone.Synth().toMaster
    console.log(synth)
    }
    removeTrack = (e) => {
        const {[e.target.id]: _, ...newState} = this.state.tracks
        this.setState({
            tracks: newState
        })
    }
    toggleNote = (e) => {
        let uuid = e.target.attributes.uuid.value
        let index = e.target.attributes.index.value
        let newVal = Number(e.target.attributes.val.value) ? 0 : 1
        this.setState((prevState)=>({
            tracks: {...prevState.tracks, [uuid]: {sequence: [...prevState.tracks[uuid].sequence.slice(0,Number(index)), newVal, ...prevState.tracks[uuid].sequence.slice(Number(index)+1)], uuid:uuid}}
        }))
    }
    startPlayback = () => {
        this.setState({
            playing: true
        })
    }
    stopPlayback = () => {
        this.setState({
            playing:false
        })
    }
    setTempo = (e) => {
        this.setState({
            bpm: e.target.value
        })
    }
  render() {
    return <div>
        {Object.values(this.state.tracks).map((t, index) => {
            let uuid = Object.keys(this.state.tracks)[index]
            return <SequencerTrack key={uuid} removeTrack={this.removeTrack} toggleNote={this.toggleNote} track={{...t, uuid}}/>
        })}
        <button onClick={this.addTrack}>+</button>
        <PlaybackControls 
        startPlayback={this.startPlayback}
        stopPlayback={this.stopPlayback}
        setTempo={this.setTempo}
        />

    </div>
  }
}
