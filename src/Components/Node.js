import React from 'react';

class Node extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let nodeStyle = {
            'width': this.props.nodeDimension,
            'height': this.props.nodeDimension,
            'background': this.props.infected ? 'hotpink' : 'lightskyblue'
        };

        return (
            <div style={nodeStyle}></div>
        )
    }
}

export default Node;