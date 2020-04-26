class NodeStatus {
    constructor(currentStatus, eventualStatus, stepsToEventualStatus) {
        this.currentStatus = currentStatus;
        this.eventualStatus = eventualStatus;
        this.stepsToEventualStatus = stepsToEventualStatus;
    }

    get currentStatus() {
        return this._currentStatus;
    }

    get eventualStatus() {
        return this._eventualStatus;
    }

    get stepsToEventualStatus() {
        return this._stepsToEventualStatus;
    }

    set currentStatus(status) {
        this._currentStatus = status;
    }

    set eventualStatus(status) {
        this._eventualStatus = status;
    }

    set stepsToEventualStatus(steps) {
        this._stepsToEventualStatus = steps;
    }
}

export default NodeStatus;