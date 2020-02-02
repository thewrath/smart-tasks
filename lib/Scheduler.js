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
     * @param {taskContainer} - TaskContainer to loop on
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
                let task = this.taskContainer.getTasks()[taskName];
                if (task != null && task != undefined){
                    this.taskTimeouts[taskName] += 1;
                    // Handle frequency
                    if (task.frequency !== 0 && this.taskTimeouts[taskName] >= task.frequency) {
                        this._executeTask(task, taskName);
                    } else if (task.date != undefined && task.date <= Date.now()){
                        this._executeTask(task, taskName);
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

    /**
     * Execute task (call it's run method)
     * @param {Task} task - task object to execute
     * @param {String} taskName - task name
     */
    _executeTask(task, taskName) {
        try {
            task.run();
            // If task is in single run mode remove it from the scheduler
            if (task.singleRun === true) {
                delete this.taskContainer.getTasks()[taskName];
            }
        } catch (error) {
            throw new TaskError(`Cannot run task : ${task}`, task);
        } finally {
            this.taskTimeouts[taskName] = 0;
        }
    }
}

/**
 * @module
 */
module.exports = Scheduler;
