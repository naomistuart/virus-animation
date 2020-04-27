import React from 'react';
import Slider from '@material-ui/core/Slider';

class ParamaterControls extends React.Component {
    constructor(props) {
        super(props);
        this.handleDeathRateChange = this.handleDeathRateChange.bind(this);
    }

    handleDeathRateChange(e) {
        this.props.onDeathRateChange(e.target.value);
    }
    
    render() {
        return (
            <div>
                <Slider
                    value={this.props.deathRate}
                    onChange={this.handleDeathRateChange}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={0}
                    max={100}
                />
            </div>
        )
    }
}

export default ParamaterControls;