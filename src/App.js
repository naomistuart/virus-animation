import React from 'react';
import './App.css';
import Grid from './Components/Grid'

class App extends React.Component {
  render() {
    return (
      <Grid nodeDimension={10}
            gridDimension={40}
            infectionRate={0.1}
            animationSpeed={500}
      />
    )
  }
}

export default App;
