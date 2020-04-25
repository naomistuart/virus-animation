import React from 'react';
import Node from './Node';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nodeGrid: [],
            statusGrid: [],
            playAnimation: false
        }
        this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
        this.handleStepButtonClick = this.handleStepButtonClick.bind(this);
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
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    handlePlayButtonClick() {
        if (!this.state.playAnimation) {
            this.timerID = setInterval(
                () => this.tick(), this.props.animationSpeed
            );
        } else {
            clearInterval(this.timerID);
        }
        this.setState({
            playAnimation: !this.state.playAnimation
        });
    }

    handleStepButtonClick() {
        this.setState({
            playAnimation: false,
        });

        clearInterval(this.timerID);
        this.tick();
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
            statusGrid: newStatusGrid,
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
            <div>
                <div style={gridStyle}>
                    {this.state.nodeGrid}
                </div>

                <IconButton variant="contained" onClick={this.handlePlayButtonClick}>
                    {this.state.playAnimation ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <Button variant="contained" onClick={this.handleStepButtonClick}>
                    Step
                </Button>
            </div>
        );
    }
}

export default Grid;