import React, {PureComponent} from 'react'

export default class SequencerTrack extends PureComponent {
    render(){
        const { track } = this.props
        return(
            <div>
                <span>track {track.uuid}</span>
                <button id={track.uuid} onClick={this.props.removeTrack}>-</button>
                {track.sequence.map((sequencePoint,index)=>{
                    return <span val={sequencePoint} key={index} uuid={track.uuid} index={index} onClick={this.props.toggleNote}>{sequencePoint}</span>
                })}
            </div>
        )
    }
}