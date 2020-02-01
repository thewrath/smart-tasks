/**
 * @author thewrath 
 */
const TaskContainer = require('./TaskContainer');

/**
 * @module
 * @description The task container builder
 */
module.exports = {
    /**
     * @function create
     * @description Create an empty task container
     */
    create() {
        return new TaskContainer();
    },

    /**
     * @function build
     * @description Create a container with a configuration file
     * @param {string} rootDir - The absolute path of the root directory
     * @param {string} configPath - The relative path of the configuration file
     */
    build(rootDir, configPath, container) {
        const taskContainer = new TaskContainer();
        taskContainer.load(rootDir, configPath, container);
        return taskContainer;
    }
};
