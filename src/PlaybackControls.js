import React, { PureComponent } from "react"

export default class PlaybackControls extends PureComponent {
  render() {
    return <div>
            <input type="range" min="40" max="220" value={this.props.bpm} onChange={this.props.setTempo}/>

      <button onClick={this.props.startPlayback}>Start</button>
      <button onClick={this.props.stopPlayback}>Stop</button>
      </div>
  }
}
