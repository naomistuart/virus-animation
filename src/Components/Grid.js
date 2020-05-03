import React from 'react';
import Node from './Node';
import NodeStatus from '../Util/NodeStatus';
import statuses from '../Util/statuses'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Slider from '@material-ui/core/Slider';
import '../App.css';

class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nodeGrid: [],
            statusGrid: [],
            playAnimation: false,
            deathRate: this.props.deathRate,
            infectionRate: this.props.infectionRate,
            stepsToRecovery: this.props.stepsToRecovery,
            stepsToDeath: this.props.stepsToDeath
        }
        this.handleStepButtonClick = this.handleStepButtonClick.bind(this);
        this.togglePlayPause = this.togglePlayPause.bind(this);
        this.resetAnimation = this.resetAnimation.bind(this);
        this.handleDeathRateChange = this.handleDeathRateChange.bind(this);
        this.handleInfectionRateChange = this.handleInfectionRateChange.bind(this);
        this.handleStepsToRecoveryChange = this.handleStepsToRecoveryChange.bind(this);
        this.handleStepsToDeathChange = this.handleStepsToDeathChange.bind(this);
    }

    handleDeathRateChange(event, value) {
        this.setState({
            deathRate: value / 100
        });
    }

    handleInfectionRateChange(event, value) {
        this.setState({
            infectionRate: value / 100
        });
    }

    handleStepsToRecoveryChange(event, value) {
        this.setState({
            stepsToRecovery: value
        });
    }

    handleStepsToDeathChange(event, value) {
        this.setState({
            stepsToDeath: value
        });
    }

    componentDidMount() {
        this.setUpGrid();
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    setNodeInitialInfectionStatus() {
        if (Math.random() <= this.state.infectionRate) {
            return statuses.INFECTED;
        } else {
            return statuses.SUSCEPTIBLE;
        }
    }

    setNodeInfectionStatus(numInfectedNeighbours) {
        if (Math.random() <= (1 - Math.pow((1 - this.state.infectionRate), numInfectedNeighbours))) {
            return statuses.INFECTED;
        } else {
            return statuses.SUSCEPTIBLE;
        }
    }

    setNodeEventualStatus(currentStatus) {
        if (currentStatus !== statuses.INFECTED) {
            return currentStatus;
        } else if (Math.random() <= this.state.deathRate) {
            return statuses.DEAD;
        } else {
            return statuses.RECOVERED;
        }
    }

    setNodeStepsToEventualStatus(eventualStatus) {
        if (eventualStatus === statuses.RECOVERED) {
            return this.props.stepsToRecovery;
        } else if (eventualStatus === statuses.DEAD) {
            return this.props.stepsToDeath;
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
        }
        if (i > 0) { // Check top neighbour
            numInfectedNeighbours = statusGrid[i - 1][j].currentStatus===statuses.INFECTED ? numInfectedNeighbours + 1 : numInfectedNeighbours;
        }
        if (j < this.props.gridDimension - 1) { // Check right neighbour
            numInfectedNeighbours = statusGrid[i][j + 1].currentStatus===statuses.INFECTED ? numInfectedNeighbours + 1 : numInfectedNeighbours;
        }
        if (j > 0) { // Check left neighbour
            numInfectedNeighbours = statusGrid[i][j - 1].currentStatus===statuses.INFECTED ? numInfectedNeighbours + 1 : numInfectedNeighbours;
        }
        
        return numInfectedNeighbours;
    }

    tick() {
        let statusGrid = this.state.statusGrid;
        let newNodeGrid = [];
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

                if (statusGrid[i][j].currentStatus === statuses.INFECTED) {
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
                } else if (statusGrid[i][j].currentStatus === statuses.SUSCEPTIBLE) {
                    numInfectedNeighbours = this.findNumberOfInfectedNeighbours(statusGrid, i, j);
                    nodeStatus = this.setNodeInfectionStatus(numInfectedNeighbours);
                    nodeEventualStatus = this.setNodeEventualStatus(nodeStatus);
                    nodeStepsToEventualStatus = this.setNodeStepsToEventualStatus(nodeEventualStatus);

                    newStatusRow[j].currentStatus = nodeStatus;
                    newStatusRow[j].eventualStatus = nodeEventualStatus;
                    newStatusRow[j].stepsToEventualStatus = nodeStepsToEventualStatus;

                    newNodeRow[j] = <Node key={`${i}-${j}`}
                                          nodeDimension={this.props.nodeDimension}
                                          status={nodeStatus} />;
                } else {
                    newNodeRow[j] = <Node key={`${i}-${j}`}
                                          nodeDimension={this.props.nodeDimension}
                                          status={newStatusRow[j].currentStatus} />;
                }
            }

            newNodeGrid[i] = newNodeRow;
            newStatusGrid[i] = newStatusRow;
        }

        this.setState({
            nodeGrid: newNodeGrid,
            statusGrid: newStatusGrid,
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
            <div>
                {/* Grid */}
                <div style={gridStyle}>
                    {this.state.nodeGrid}
                </div>

                {/* Playback controls */}
                {this.props.showPlaybackControls &&
                <div className="Hflex">
                    <Button className="button" variant="contained" onClick={this.resetAnimation}>
                        Reset
                    </Button>
                    <IconButton variant="contained" onClick={this.togglePlayPause}>
                        {this.state.playAnimation ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <Button className="button" variant="contained" onClick={this.handleStepButtonClick}>
                        Step
                    </Button>
                </div>
                }

                {(this.props.showInfectionRateSlider || this.props.showDeathRateSlider || this.props.showStepsToRecoverySlider || this.props.showStepsToDeathSlider) &&
                    <div>
                        <div className='Spacer'></div>

                        {/* Parameter controls */}
                        <div className="Vflex">
                            {/* Infection Rate */}
                            {this.props.showInfectionRateSlider &&
                                <div className="slider-background">
                                    <p className="slider-title">Transmission Rate: {Math.round(this.state.infectionRate * 100)}%</p>
                                    <div className="slider">
                                        <Slider
                                            value={Math.round(this.state.infectionRate * 100)}
                                            onChange={this.handleInfectionRateChange}
                                            aria-labelledby="infection-rate-slider"
                                            step={1}
                                            min={0}
                                            max={100}
                                        />
                                    </div>
                                </div>
                            }

                            {/* Death Rate */}
                            {this.props.showDeathRateSlider &&
                                <div className="slider-background">
                                    <p className="slider-title">Death Rate: {Math.round(this.state.deathRate * 100)}%</p>
                                    <div className="slider">
                                        <Slider
                                            value={Math.round(this.state.deathRate * 100)}
                                            onChange={this.handleDeathRateChange}
                                            aria-labelledby="death-rate-slider"
                                            step={1}
                                            min={0}
                                            max={100}
                                        />
                                    </div>
                                </div>
                            }

                            {/*  Steps to recovery */}
                            {this.props.showStepsToRecoverySlider &&
                                <div className="slider-background">
                                    <p className="slider-title">Time to Recovery: {this.state.stepsToRecovery} days</p>
                                    <div className="slider">
                                        <Slider
                                            value={this.state.stepsToRecovery}
                                            onChange={this.handleStepsToRecoveryChange}
                                            aria-labelledby="steps-to-recovery-slider"
                                            step={1}
                                            min={0}
                                            max={21}
                                        />
                                    </div>
                                </div>
                            }

                            {/*  Steps to death */}
                            {this.props.showStepsToDeathSlider &&
                                <div className="slider-background">
                                    <p className="slider-title">Time to Death: {this.state.stepsToDeath} days</p>
                                    <div className="slider">
                                        <Slider
                                            value={this.state.stepsToDeath}
                                            onChange={this.handleStepsToDeathChange}
                                            aria-labelledby="steps-to-death-slider"
                                            step={1}
                                            min={0}
                                            max={21}
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }

            </div>
        );
    }
}

export default Grid;