import React from 'react';
import './App.css';
import Grid from './Components/Grid'

class App extends React.Component {
  render() {
    return (
      <Grid nodeDimension={50}
            gridDimension={10}
      />
    )
  }
}

export default App;
