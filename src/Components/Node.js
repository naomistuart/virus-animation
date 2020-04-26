import React from 'react';
import Constants from '../Util/Constants'

class Node extends React.Component {
    //setStatus


    //step

    


    //getStatus

    //setEventualStatus
    //getEventualStatus

    print(){
        console.log("a");
        }

    render() {
        let nodeStyle = {
            'width': this.props.nodeDimension,
            'height': this.props.nodeDimension,
            'background': this.props.infected ? Constants.INFECTED_COLOR : Constants.SUSCEPTIBLE_COLOR
        };

        return (
            <div style={nodeStyle}></div>
        );
    }
}

export default Node;