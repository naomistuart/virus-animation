import React from 'react';
import './App.css';
import Grid from './Components/Grid'

class App extends React.Component {
  render() {
    return (
      <Grid nodeDimension={4}
            gridDimension={40}
      />
    )
  }
}

export default App;
