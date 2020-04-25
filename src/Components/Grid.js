import React from 'react';
import Node from './Node';

class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nodeGrid: [],
            statusGrid: []
        }
        this.findNumberOfInfectedNeighbours = this.findNumberOfInfectedNeighbours.bind(this);
    }

    componentDidMount() {
        // Initialise grid
        let initialNodeGrid = [];
        let initialStatusGrid = [];
        for (let i = 0; i < this.props.gridDimension; i++) {
            let nodeRow = [];
            let statusRow = [];
            for (let j = 0; j < this.props.gridDimension; j++) {
                let nodeIsInfected = Math.random() <= this.props.infectionRate;
                statusRow[j] = nodeIsInfected;
                nodeRow[j] = <Node key={`${i}-${j}`}
                                   nodeDimension={this.props.nodeDimension}
                                   infected={nodeIsInfected} />;
            }
            initialNodeGrid[i] = nodeRow;
            initialStatusGrid[i] = statusRow;
        }
        this.setState({
            nodeGrid: initialNodeGrid,
            statusGrid: initialStatusGrid
        });

        // Start animation
        this.timerID = setInterval(
            () => this.tick(), this.props.animationSpeed
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    findNumberOfInfectedNeighbours(statusGrid, i, j) {
        let numInfectedNeighbours = 0;

        if (i < this.props.gridDimension - 1) { // Check bottom neighbour
            numInfectedNeighbours = statusGrid[i + 1][j] ? numInfectedNeighbours + 1 : numInfectedNeighbours;
        }
        if (i > 0) { // Check top neighbour
            numInfectedNeighbours = statusGrid[i - 1][j] ? numInfectedNeighbours + 1 : numInfectedNeighbours;
        }
        if (j < this.props.gridDimension - 1) { // Check right neighbour
            numInfectedNeighbours = statusGrid[i][j + 1] ? numInfectedNeighbours + 1 : numInfectedNeighbours;
        }
        if (j > 0) { // Check left neighbour
            numInfectedNeighbours = statusGrid[i][j - 1] ? numInfectedNeighbours + 1 : numInfectedNeighbours;
        }

        return numInfectedNeighbours;
    }

    tick() {

        // if(!simulation){
        //     return;
        // }
        let newNodeGrid = [];
        let newStatusGrid = [];
        let statusGrid = this.state.statusGrid;

        for (let i = 0; i < this.props.gridDimension; i++) {
            let newNodeRow = [];
            let newStatusRow = [];
            
            for (let j = 0; j < this.props.gridDimension; j++) {
                let numInfectedNeighbours = this.findNumberOfInfectedNeighbours(statusGrid, i, j);

                // Update nodes
                if (statusGrid[i][j] || numInfectedNeighbours === 0) {
                    let nodeIsInfected = statusGrid[i][j];
                    newStatusRow[j] = nodeIsInfected;
                    newNodeRow[j] = <Node key={`${i}-${j}`} 
                                          nodeDimension={this.props.nodeDimension}
                                          infected={nodeIsInfected} />;
                } else {
                    let nodeIsInfected = (Math.random() <= (1 - Math.pow((1 - this.props.infectionRate), numInfectedNeighbours)));
                    newStatusRow[j] = nodeIsInfected;
                    newNodeRow[j] = <Node key={`${i}-${j}`} 
                                          nodeDimension={this.props.nodeDimension}
                                          infected={nodeIsInfected} />;
                }
            }
            newStatusGrid[i] = newStatusRow;
            newNodeGrid[i] = newNodeRow;
        }

        // Update grids
        this.setState({
            nodeGrid: newNodeGrid, 
            statusGrid: newStatusGrid
        });
    }

    render() {
        let gridStyle = {
            'display': 'grid',
            'gridGap': '0.2em',
            'gridTemplateRows': `repeat(${this.props.gridDimension}, ${this.props.nodeDimension}px)`,
            'gridTemplateColumns': `repeat(${this.props.gridDimension}, ${this.props.nodeDimension}px)`
        };

        return (
            <div style={gridStyle}>
                {this.state.nodeGrid}
            </div>
        );
    }
}

export default Grid;