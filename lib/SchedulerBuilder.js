/**
 * @author Thewrath 
 */
const Scheduler = require('./Scheduler');

/**
 * @module
 * @description The scheduler builder
 */
module.exports = {
    /**
     * @function create
     * @description Create an empty scheduler
     */
    create() {
        return new Scheduler();
    },

    /**
     * @function build
     * @description Create a container with a configuration file
     * @param {string} rootDir - The absolute path of the root directory
     * @param {string} configPath - The relative path of the configuration file
     */
    build(rootDir, configPath, container) {
        const scheduler = new Scheduler();
        scheduler.load(rootDir, configPath, container);
        return scheduler;
    }
};
