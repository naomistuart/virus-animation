import React from 'react';
import Node from './Node';

class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            infectedList: [],
            infectionRate: 0.3
        }
        for (let i = 0; i < this.props.gridDimension; i++) {
            let nodeRow = []
            let infectionRow = []
            for (let j = 0; j < this.props.gridDimension; j++) {
                let infected = Math.random() <= this.state.infectionRate;

                nodeRow[j] = <Node key={i * 100 + j} nodeDimension={this.props.nodeDimension} infected={infected} />
                infectionRow[j] = infected;
            }
            this.state.grid[i] = nodeRow;
            this.state.infectedList[i] = infectionRow;
        }
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

        // if(!simulation){
        //     return;
        // }
        let newGrid = [];
        let newInfectedList = []
        
        let infectedList = this.state.infectedList;
        for (let i = 0; i < this.props.gridDimension; i++) {
            let newGridRow = [];
            let newInfectedRow = [];
            for (let j = 0; j < this.props.gridDimension; j++) {

                console.log(infectedList[i][j]);

                let infectedNeighbourCount = 0;
                if (i < this.props.gridDimension - 1) {
                        infectedNeighbourCount = infectedList[i + 1][j] ? infectedNeighbourCount + 1 : infectedNeighbourCount;
                }
                if (i > 0) {
                    infectedNeighbourCount = infectedList[i - 1][j] ? infectedNeighbourCount + 1 : infectedNeighbourCount;
                }
                if (j < this.props.gridDimension - 1) {
                    infectedNeighbourCount = infectedList[i][j+1] ? infectedNeighbourCount + 1 : infectedNeighbourCount;
                }
                if (j > 0) {
                    infectedNeighbourCount = infectedList[i][j-1] ? infectedNeighbourCount + 1 : infectedNeighbourCount;
                }

                console.log("Infected neighbour count = " + infectedNeighbourCount);


                if(infectedList[i][j] || infectedNeighbourCount === 0){
                    let thisNodeInfected = infectedList[i][j];
                    newInfectedRow[j] = thisNodeInfected;
                    newGridRow[j] = <Node key={i * 100 + j} nodeDimension={this.props.nodeDimension} infected={thisNodeInfected} />
                }
                else{
                    let thisNodeInfected = (Math.random() <= 1 - Math.pow((1 - this.state.infectionRate), infectedNeighbourCount));
                    newInfectedRow[j] = thisNodeInfected;
                    newGridRow[j] = <Node key={i * 100 + j} nodeDimension={this.props.nodeDimension} infected={thisNodeInfected} />
                }
            }
            newInfectedList[i] = newInfectedRow;
            newGrid[i] = newGridRow;
        }

        this.setState({grid: newGrid, infectedList: newInfectedList});

        // this.setState({
        //     infected: Math.random() >= 0.5
        // })
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
                {this.state.grid}
            </div>
        )
    }
}

export default Grid;