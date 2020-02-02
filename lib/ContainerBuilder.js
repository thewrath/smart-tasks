/**
 * @author thewrath 
 */
const Container = require('./Container');

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
        return new Container();
    },

    /**
     * @function build
     * @description Create a container with a configuration file
     * @param {string} rootDir - The absolute path of the root directory
     * @param {string} configPath - The relative path of the configuration file
     * @param {any} servicesContainer - services container from smart-container
     */
    build(rootDir, configPath, servicesContainer) {
        const container = new Container();
        container.load(rootDir, configPath, servicesContainer);
        return container;
    }
};
