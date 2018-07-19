import React, { PureComponent } from "react"

export default class SequencerTrack extends PureComponent {
  render() {
    const { track } = this.props
    return (
      <tr>
        <td>
          <span>{track.name}</span>
          <button id={track.uuid} onClick={this.props.removeTrack}>
            x
          </button>
        </td>
        {track.sequence.map((sequencePoint, index) => {
          return (
            <td
              val={sequencePoint}
              key={index}
              uuid={track.uuid}
              index={index}
              onClick={this.props.toggleNote}
            >
              {sequencePoint}
            </td>
          )
        })}
        <td>
            <input uuid={track.uuid} type="range" max="0" min="-1000000480" onChange={this.props.changeTrackVolume}/>
        </td>
      </tr>
    )
  }
}
