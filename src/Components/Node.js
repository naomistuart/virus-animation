import React from 'react';

class Node extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infected: Math.random() >= 0.5
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            infected: Math.random() >= 0.5
        })
    }

    render() {
        let nodeStyle = {
            'width': this.props.nodeDimension,
            'height': this.props.nodeDimension,
            'background': this.state.infected ? 'hotpink' : 'lightskyblue'
        };

        return (
            <div style={nodeStyle}></div>
        )
    }
}

export default Node;