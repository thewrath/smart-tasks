'use strict'
/**
 * @author thewrath
 */

class Task {
    constructor(container, frequency, date) {
        this.container = container;
        this.frequency = frequency;
        this.date = date;
        this.singleRun = false;
    }

    async run() {

    }
}

module.exports = Task
