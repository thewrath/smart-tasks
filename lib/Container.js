/**
 * @author  thewrath
 */
const path = require('path');
const fs = require('fs');
const clone = require('clone');
const TaskDefinition = require('./TaskDefinition');

/**
 * @class Container
 */
class Container {
  /**
     * @constructor
     */
  constructor() {
    this.tasks = {};
    this.properties = {};
    this.taskDefinitions = {};
  }

  /**
     * @function load
     * @description Load a configuration file
     * @param {string} rootDir - The absolute path of the root directory
     * @param {string} configPath - The relative path of the configuration file
     * @throws {Error}
     */
  load(rootDir, configPath, container) {
    const configFile = path.join(rootDir, configPath);
    this.configDir = path.dirname(configFile);
    if (!fs.existsSync(configFile)) {
      throw new Error('Configuration file not found');
    }
    this.configuration = require(configFile);
    this.setContainer(container);

    if (this.configuration.properties) {
      this.properties = this.configuration.properties;
    }
    if (this.configuration.tasks) {
      for (const key of Object.keys(this.configuration.tasks)) {
        const task = this.configuration.tasks[key];
        const isSingleton = task.isSingleton !== undefined ? task.isSingleton : true;
        if (!task.path) {
          throw new Error(`The path for the task "${key}" is required`);
        }
        let filePath = `${this.configDir}/${task.path}`;
        if (path.isAbsolute(task.path)) {
          filePath = task.path;
        }
        if (path.extname(filePath) === '') {
          filePath += '.js';
        }
        if (!fs.existsSync(filePath)) {
          throw new Error(`The path for the task "${key}" is not exists`);
        }
        // defaults parameters value
        const frequency = task.frequency !== undefined ? task.frequency : 0;
        const date = task.date !== undefined ? task.date : undefined;
        const singleRun = task.singleRun !== undefined ? task.singleRun : false;

        this.register(key, require(filePath), isSingleton, frequency, date, singleRun)
          .addArguments(task.constructorArgs || [])
          .addMethodCalls(task.calls || []);
      }
    }
  }

  /**
     * @function createTask
     * @description Create a task
     * @param {string} name - the name of the task
     * @returns {Object} the task
     * @throws {Error}
     */
  createTask(name) {
    if (!this.taskDefinitions[name]) {
      throw new Error(`No task "${name}" available`);
    }
    /* Check if the task already exists (Implicitly, it's a singleton) */
    if (this.tasks[name]) {
      return this.tasks[name];
    }

    let task = null;
    const definition = this.taskDefinitions[name];
    let args = this.constructArguments(definition.constructorArgs);

    if (typeof definition.class === 'function') {
      task = new (Function.prototype.bind.apply(definition.class))(this.container, definition.frequency, definition.date, definition.singleRun);
    } else {
      task = this.taskDefinitions[name].isSingleton ? definition.class : clone(definition.class);
    }
    for (const call of definition.methodCalls) {
      if (!task[call.method]) {
        throw new Error(`Task "${name}" doesn't have a function called "${call.method}"`);
      }
      args = this.constructArguments(call.args);
      task[call.method](...args);
    }

    if (this.taskDefinitions[name].isSingleton) {
      this.tasks[name] = task;
    }
    return task;
  }

  /**
     * @function constructArguments
     * @description Construct the arguments (check if the arguments is a task, a property or a literal)
     * @param {Array} argumentsList - the array of the arguments
     * @returns {Array} the arguments
     * @throws {Error}
     */
  constructArguments(argumentsList) {
    const args = [];
    for (const arg of argumentsList) {
      if (typeof arg === 'string' && arg.startsWith('@')) { /* -> Check if the argument is a task reference */
        const taskName = arg.substr(1);
        args.push(this.get(taskName));
      } else if (typeof arg === 'string' && /^%[^%]+%$/.test(arg)) { /* -> Check if the argument is a property */
        const argumentsPath = arg.replace(/%/g, '');
        if (!this.properties[argumentsPath.split('.')[0]]) {
          throw new Error(`Property "${argumentsPath}" not found`);
        }
        args.push(this.getProperty(argumentsPath));
      } else { /* -> The argument is a literal */
        args.push(arg);
      }
    }
    return args;
  }

  /**
     * @function get
     * @description Get a task by name
     * @param {string} name - the name of the task
     * @returns {Object} the task
     * @throws {Error}
     */
  get(name) {
    return this.createTask(name);
  }

  /**
     * @function register
     * @description Register a task
     * @param {string} name - the name of the task
     * @param {Function|Object} taskClass - the class or the literal object of the task
     * @param {Boolean} [isSingleton = true] - true if the task is a singleton, false otherwise
     * @param {number} frequency - The frequency to run the task
     * @returns {TaskDefinition} the task definition
     * @throws {Error}
     */
  register(name, taskClass, isSingleton, frequency, date, singleRun) {
    if (this.hasTask(name)) {
      throw new Error(`The task "${name}" already exists`);
    }
    this.taskDefinitions[name] = new TaskDefinition(name, taskClass, isSingleton, frequency, date, singleRun);
    return this.taskDefinitions[name];
  }

  /**
     * @function buildAllTasks
     * @description Build all tasks registered in this.taskDefinitions, usefull when you want to loop and call all tasks
     * @throws {Error}
     */
  buildAllTasks() {
    for (const taskDefinition in this.taskDefinitions) {
      this.get(taskDefinition);
    }
  }

  /**
     * @function getTasks
     * @description Return all contsructed tasks
     * @returns {Array}
     */
  getTasks() {
    return this.tasks;
  }

  /**
     * @function hasTask
     * @description Check if the task exists
     * @param {string} name - the name of the task
     * @returns {Boolean} true if the task exists, false otherwise
     */
  hasTask(name) {
    return this.taskDefinitions[name] !== undefined;
  }

  /**
     * @function getProperty
     * @description Get a property by name
     * @param {string} name - the name of the property
     * @returns {Array|number|string|Boolean|Object} the property
     * @throws {Error}
     */
  getProperty(name) {
    const property = name.split('.').reduce((prev, curr) => prev[curr], this.properties);
    if (property === undefined) {
      throw new Error(`The property "${name}" was not found`);
    }
    return clone(property);
  }

  /**
     * @function addProperty
     * @description add a property
     * @param {string} name - the name of the property
     * @param {Array|number|string|Boolean|Object} value - the value of property
     * @throws {Error}
     * @return {this}
     */
  addProperty(name, value) {
    if (this.hasProperty(name)) {
      throw new Error(`The property "${name}" is already exists`);
    }
    this.properties[name] = value;
    return this;
  }

  /**
     * @function hasProperty
     * @description Check if a property exists
     * @param {string} name - the name of the property
     * @returns {Boolean} true if the property exists, false otherwise
     */
  hasProperty(name) {
    return this.properties[name] !== undefined;
  }

  /**
     * @function setContainer
     * @description Set scheduler container, used to build task
     * @param {any} container
     * @returns {this}
     */
  setContainer(container) {
    this.container = container;
    return this;
  }

  /**
     * @function getContainer
     * @description get scheduler container
     * @returns {any}
     */
  getContainer() {
    return this.container;
  }
}

/**
 * @module
 */
module.exports = Container;
