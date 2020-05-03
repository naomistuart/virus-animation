import React from 'react';
import Constants from '../Util/Constants'
import statuses from '../Util/statuses'


class Node extends React.PureComponent {

    render() {
        let background;
        switch(this.props.status) {
            case statuses.SUSCEPTIBLE:
                background = Constants.SUSCEPTIBLE_COLOR;
                break;
            case statuses.INFECTED:
                background = Constants.INFECTED_COLOR;
                break;
            case statuses.RECOVERED:
                background = Constants.RECOVERED_COLOR;
                break;
            case statuses.DEAD:
                background = Constants.DEAD_COLOR;
                break;
            default:
                background = Constants.ERROR_COLOR;
        }

        let nodeStyle = {
            'width': this.props.nodeDimension,
            'height': this.props.nodeDimension,
            'background': background,
            'text-align': 'center',
            'font-size': '20px',
            'display': 'inline-block',
            'vertical-align': 'middle',
        };

        return (
            <div style={nodeStyle}>{this.props.nodeText}</div>
        );
    }
}

export default Node;