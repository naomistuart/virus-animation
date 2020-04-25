import React from 'react';

class Node extends React.Component {

    render() {
        let nodeStyle = {
            'width': this.props.nodeDimension,
            'height': this.props.nodeDimension
        };

        return (
            <div className="node"
                 style={nodeStyle}>
            </div>
        )
    }
}

export default Node;