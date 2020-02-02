/**
 * @author  thewrath
 */
const Container = require('./Container');
const TaskError = require('./TaskError')

/**
 * @class Scheduler
 */
class Scheduler {

    /**
     * @constructor
     */
    constructor(taskContainer) {
        if(!(taskContainer instanceof Container)) {
            throw new TypeError("TaskContainer need to be instance of TaskContainer");
        }
        this.taskContainer = taskContainer;
        this.taskTimeouts = {};
    }

    /**
     * Init method, initialize task timeout history
     */
    init() {
        this.taskContainer.buildAllTasks();
        for (const taskName in this.taskContainer.getTasks()) {
            this.taskTimeouts[taskName] = 0;
        }
    }

    /**
     * Run method, the scheduler loop throw all task an run it
     * @param {Number} timeout - Period of the runner, 1s by default
     * @param {Function} callback - Function call every loop, for debug purpose
     */
    run(timeout=1000, callback=null) {
        return setInterval(() => {
            // Run tasks
            for (const taskName in this.taskContainer.getTasks()) {
                if (this.taskContainer.getTasks()[taskName] != null && this.taskContainer.getTasks()[taskName] != undefined){
                    this.taskTimeouts[taskName] += 1;
                    // Handle frequency
                    if (this.taskTimeouts[taskName] >= this.taskContainer.getTasks()[taskName].frequency) {
                        try {
                            this.taskContainer.getTasks()[taskName].run();
                            // If task is in single run mode remove it from the scheduler
                            if (this.taskContainer.getTasks()[taskName].singleRun === true) {
                                delete this.taskContainer.getTasks()[taskName];
                            }
                        } catch (error) {
                            throw new TaskError(`Cannot run task : ${this.taskContainer.getTasks()[taskName]}`, this.taskContainer.getTasks()[taskName]);
                        } finally {
                            this.taskTimeouts[taskName] = 0;
                        }
                        
                    }
                }
            }

            try {
                if (callback != null) callback();
            } catch (error) {
                throw new Error("Error in custom scheduler's callback")
            }
        }, timeout);
    }
}
/**
 * @module
 */
module.exports = Scheduler;
