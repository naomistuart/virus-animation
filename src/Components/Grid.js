import React from 'react';
import Node from './Node';

class Grid extends React.Component {

    render() {
        let grid = [];
        for (let i = 0; i < Math.pow(this.props.gridDimension, 2); i++) {
            grid.push(<Node nodeDimension={this.props.nodeDimension}/>);

        }

        let gridStyle = {
            'display': 'grid',
            'grid-gap': '0.2em',
            'grid-template-rows': `repeat(${this.props.gridDimension}, ${this.props.nodeDimension}px)`,
            'grid-template-columns': `repeat(${this.props.gridDimension}, ${this.props.nodeDimension}px)`
        };

        return (
            <div style={gridStyle}>
                {grid}
            </div>
        )
    }
}

export default Grid;