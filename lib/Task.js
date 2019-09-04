'use strict'
/**
 * @author thewrath
 */

class Task {
    constructor(container, frequency) {
        this.container = container
        this.frequency = frequency
    }

    run() {
        return true
    }
}

module.exports = Task
