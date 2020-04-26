import React from 'react';
import Node from './Node';
import NodeStatus from '../Util/NodeStatus';
import statuses from '../Util/statuses'
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
        this.handleStepButtonClick = this.handleStepButtonClick.bind(this);
        this.togglePlayPause = this.togglePlayPause.bind(this);
        this.resetAnimation = this.resetAnimation.bind(this);
    }

    componentDidMount() {
        this.setUpGrid();
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    setNodeInitialInfectionStatus() {
        if (Math.random() <= this.props.infectionRate) {
            return statuses.INFECTED;
        } else {
            return statuses.SUSCEPTIBLE;
        }
    }

    setNodeInfectionStatus(numInfectedNeighbours) {
        if (Math.random() <= (1 - Math.pow((1 - this.props.infectionRate), numInfectedNeighbours))) {
            return statuses.INFECTED;
        } else {
            return statuses.SUSCEPTIBLE;
        }
    }

    setNodeEventualStatus(currentStatus) {
        if (currentStatus !== statuses.INFECTED) {
            return currentStatus;
        } else if (Math.random() <= this.props.deathRate) {
            return statuses.DEAD;
        } else {
            return statuses.RECOVERED;
        }
    }

    setNodeStepsToEventualStatus(eventualStatus) {
        if (eventualStatus === statuses.RECOVERED) {
            return this.props.meanStepsToRecovery;
        } else if (eventualStatus === statuses.DEAD) {
            return this.props.meanStepsToDeath;
        } else {
            return -1;
        }
    }

    setUpGrid() {
        let nodeGrid = [];
        let statusGrid = [];
        let nodeRow;
        let statusRow;
        let nodeStatus;
        let nodeEventualStatus;
        let nodeStepsToEventualStatus;

        // Initialise nodeGrid and statusGrid
        for (let i = 0; i < this.props.gridDimension; i++) {
            nodeRow = [];
            statusRow = [];
            for (let j = 0; j < this.props.gridDimension; j++) {
                nodeStatus = this.props.startWithSingleInfectedNode ? statuses.SUSCEPTIBLE : this.setNodeInitialInfectionStatus();
                nodeEventualStatus = this.setNodeEventualStatus(nodeStatus);
                nodeStepsToEventualStatus = this.setNodeStepsToEventualStatus(nodeEventualStatus);
                statusRow[j] = new NodeStatus(nodeStatus, nodeEventualStatus, nodeStepsToEventualStatus);
                nodeRow[j] = <Node key={`${i}-${j}`}
                                   nodeDimension={this.props.nodeDimension}
                                   status={nodeStatus} />;
            }
            nodeGrid[i] = nodeRow;
            statusGrid[i] = statusRow;
        }

        // Infect middle node if animation is initialised to index case
        if (this.props.startWithSingleInfectedNode) {
            let middleIndex = Math.floor(this.props.gridDimension / 2);
            nodeStatus = statuses.INFECTED
            nodeEventualStatus = this.setNodeEventualStatus(nodeStatus);
            nodeStepsToEventualStatus = this.setNodeStepsToEventualStatus(nodeEventualStatus);
            statusGrid[middleIndex][middleIndex].currentStatus = nodeStatus;
            statusGrid[middleIndex][middleIndex].eventualStatus = nodeEventualStatus;
            statusGrid[middleIndex][middleIndex].stepsToEventualStatus = nodeStepsToEventualStatus;
            nodeGrid[middleIndex][middleIndex] = <Node key={`${middleIndex}-${middleIndex}`}
                                                       nodeDimension={this.props.nodeDimension}
                                                       status={nodeStatus} />;
        }

        this.setState({
            nodeGrid: nodeGrid,
            statusGrid: statusGrid
        });
    }

    togglePlayPause() {
        //why does this line have to go first???
        !this.state.playAnimation ? this.playAnimation() : this.pauseAnimation();

        this.setState({
            playAnimation: !this.state.playAnimation
        });
    }

    playAnimation() {
        this.timerID = setInterval(
            () => this.tick(), this.props.animationSpeed
        );
    }

    pauseAnimation() {
        clearInterval(this.timerID);
    }

    resetAnimation() {
        clearInterval(this.timerID);
        this.setState({
            playAnimation: false,
        });
        this.setUpGrid();
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
            numInfectedNeighbours = statusGrid[i + 1][j].currentStatus===statuses.INFECTED ? numInfectedNeighbours + 1 : numInfectedNeighbours;
            //console.log('bottom: ' + numInfectedNeighbours);
        }
        if (i > 0) { // Check top neighbour
            numInfectedNeighbours = statusGrid[i - 1][j].currentStatus===statuses.INFECTED ? numInfectedNeighbours + 1 : numInfectedNeighbours;
            //console.log('top: ' + numInfectedNeighbours);
        }
        if (j < this.props.gridDimension - 1) { // Check right neighbour
            numInfectedNeighbours = statusGrid[i][j + 1].currentStatus===statuses.INFECTED ? numInfectedNeighbours + 1 : numInfectedNeighbours;
            //console.log('right: ' + numInfectedNeighbours);
        }
        if (j > 0) { // Check left neighbour
            numInfectedNeighbours = statusGrid[i][j - 1].currentStatus===statuses.INFECTED ? numInfectedNeighbours + 1 : numInfectedNeighbours;
            //console.log('left: ' + numInfectedNeighbours);
        }
        
        return numInfectedNeighbours;
    }

    tick() {
        let newNodeGrid = [];

        let statusGrid = this.state.statusGrid;
        let newStatusGrid = [];

        for (let i = 0; i < this.props.gridDimension; i++) {
            let newNodeRow = [];
            let newStatusRow = [];


            for (let j = 0; j < this.props.gridDimension; j++) {    

                let numInfectedNeighbours;
                let nodeStatus;
                let nodeEventualStatus;
                let nodeStepsToEventualStatus;

                let oldStatus = statusGrid[i][j];

                newStatusRow[j] = new NodeStatus(oldStatus.currentStatus, oldStatus.eventualStatus, oldStatus.stepsToEventualStatus);

                // Updates only required if node is currently infected or susceptible
                // No updates required if node is already recovered or dead
                if (statusGrid[i][j].currentStatus===statuses.INFECTED) {
                    if (statusGrid[i][j].stepsToEventualStatus === 0 ) {
                        newStatusRow[j].currentStatus = statusGrid[i][j].eventualStatus;
                        newNodeRow[j] = <Node key={`${i}-${j}`}
                                                  nodeDimension={this.props.nodeDimension}
                                                  status={statusGrid[i][j].eventualStatus} />;
                    } else {
                        newStatusRow[j].stepsToEventualStatus--;
                        newNodeRow[j] = <Node key={`${i}-${j}`}
                                        nodeDimension={this.props.nodeDimension}
                                        status={newStatusRow[j].currentStatus} />;
                    }
                } else if (statusGrid[i][j].currentStatus===statuses.SUSCEPTIBLE) {
                    //console.log(statusGrid);
                    numInfectedNeighbours = this.findNumberOfInfectedNeighbours(statusGrid, i, j);
                    // console.log('total infected neighbours: ' + numInfectedNeighbours);

                    nodeStatus = this.setNodeInfectionStatus(numInfectedNeighbours);
                    nodeEventualStatus = this.setNodeEventualStatus(nodeStatus);
                    nodeStepsToEventualStatus = this.setNodeStepsToEventualStatus(nodeEventualStatus);



                    newStatusRow[j].currentStatus = nodeStatus;
                    newStatusRow[j].eventualStatus = nodeEventualStatus;
                    newStatusRow[j].stepsToEventualStatus = nodeStepsToEventualStatus;

                    newNodeRow[j] = <Node key={`${i}-${j}`}
                                              nodeDimension={this.props.nodeDimension}
                                              status={nodeStatus} />;
                } else{
                    newNodeRow[j] = <Node key={`${i}-${j}`}
                                    nodeDimension={this.props.nodeDimension}
                                    status={newStatusRow[j].currentStatus} />;
                }
            }

            newNodeGrid[i] = newNodeRow;
            newStatusGrid[i] = newStatusRow;
        }

        //console.log('--------------')

        // Update grids
        this.setState({
            nodeGrid: newNodeGrid,
            statusGrid: newStatusGrid,
        });

    }

    render() {
        let gridStyle = {
            'display': 'grid',
            'gridGap': '0.1em',
            'gridTemplateRows': `repeat(${this.props.gridDimension}, ${this.props.nodeDimension}px)`,
            'gridTemplateColumns': `repeat(${this.props.gridDimension}, ${this.props.nodeDimension}px)`
        };

        return (
            <div>
                {/* Grid */}
                <div style={gridStyle}>
                    {this.state.nodeGrid}
                </div>

                {/* Playback controls */}
                <IconButton variant="contained" onClick={this.togglePlayPause}>
                    {this.state.playAnimation ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <Button variant="contained" onClick={this.handleStepButtonClick}>
                    Step
                </Button>
                <Button variant="contained" onClick={this.resetAnimation}>
                    Reset
                </Button>

            </div>
        );
    }
}

export default Grid;