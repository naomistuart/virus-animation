import React from 'react';
import './App.css';
import Grid from './Components/Grid'

class App extends React.Component {
  render() {
    return (
      <Grid nodeDimension={12}
            gridDimension={40}
            infectionRate={0.15}
            animationSpeed={500}
            startWithSingleInfectedNode={false}
      />
    )
  }
}

export default App;
