import React, { Component } from "react"
import ControlMatrix from "./ControlMatrix"
import * as Tone from "tone"

const styles = {
  centerText: {
    textAlign: "center"
  }
}

class App extends Component {
  render() {
    return (
      <div style={styles.centerText}>
        <h1>Sequencer</h1>
        <ControlMatrix />
      </div>
    )
  }
}

export default App
