import React from 'react';
import Node from './Node';
import statuses from '../Util/statuses'
import '../App.css';

class NonRandomGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nodeGrid: [],
        }
    }

    componentDidMount() {
        this.setUpGrid();
    }

    setUpGrid() {
        let nodeGrid = [];
        let nodeRow;
        let nodeStatus;
        let nodeText;
        let currentNum = 1;

        // Initialise nodeGrid and statusGrid
        for (let i = 0; i < this.props.gridDimension; i++) {
            nodeRow = [];
            for (let j = 0; j < this.props.gridDimension; j++) {
                nodeStatus = this.props.infectedNodes.includes(i * this.props.gridDimension + j) ? statuses.INFECTED : statuses.SUSCEPTIBLE;
                if (this.props.starredNodes.includes(i * this.props.gridDimension + j)) {
                    nodeText = '?'
                } else if (this.props.numberedNodes.includes(i * this.props.gridDimension + j)) {
                    nodeText = currentNum.toString();
                    currentNum++;
                } else {
                    nodeText = '';
                }

                nodeRow[j] = <Node key={`${i}-${j}`}
                                   nodeDimension={this.props.nodeDimension}
                                   status={nodeStatus}
                                   nodeText={nodeText} />;
            }
            nodeGrid[i] = nodeRow;
        }

        this.setState({
            nodeGrid: nodeGrid,
        });
    }

    render() {
        let gridStyle = {
            'display': 'grid',
            'gridGap': '1px',
            'gridTemplateRows': `repeat(${this.props.gridDimension}, ${this.props.nodeDimension}px)`,
            'gridTemplateColumns': `repeat(${this.props.gridDimension}, ${this.props.nodeDimension}px)`,
            'justifyContent': 'center'
        };

        return (
            <div style={gridStyle}>
                {this.state.nodeGrid}
            </div>
        );
    }
}

export default NonRandomGrid;