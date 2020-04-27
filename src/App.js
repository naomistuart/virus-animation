import React from 'react';
import './App.css';
import Grid from './Components/Grid';

class App extends React.Component {
  render() {
    return (
      <Grid nodeDimension={10}
            gridDimension={50}
            infectionRate={0.13}
            // deathRate={0.08}
            meanStepsToRecovery={4}
            meanStepsToDeath={10}
            animationSpeed={1}
            startWithSingleInfectedNode={true}
      />
    )
  }
}

export default App;
