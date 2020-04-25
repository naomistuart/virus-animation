import React from 'react';
import './App.css';
import Grid from './Components/Grid'

class App extends React.Component {
  render() {
    return (
      <Grid nodeDimension={40}
            gridDimension={12}
      />
    )
  }
}

export default App;
