import React from 'react';
import './App.css';
import Grid from './Components/Grid';

class App extends React.Component {
  render() {
    return (
      <Grid nodeDimension={20}
            gridDimension={40}
            infectionRate={0.6}
            deathRate={0.03}
            meanStepsToRecovery={14}
            meanStepsToDeath={14}
            animationSpeed={10}
            startWithSingleInfectedNode={true}
      />
    )
  }
}

export default App;
