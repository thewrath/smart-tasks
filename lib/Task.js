'use strict'
/**
 * @author thewrath
 */

class Task {
    constructor(container, frequency) {
        this.container = container;
        this.frequency = frequency;
        this.singleRun = false;
    }

    run() {
        return true;
    }
}

module.exports = Task
