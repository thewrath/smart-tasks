/**
 * @author       thewrath 
 */

/**
 * @class TaskDefinition
 */
class TaskDefinition {

    /**
     * @constructor
     * @param {string} name - the name of the service
     * @param {Function|Object} serviceClass - the class or the literal object of the service
     * @param {Boolean} [isSingleton = true] - true if the service is a singleton, false otherwise.
     * @param {number} frequency - frequency to run the task 
     * @return {ServiceDefinition} this
     */
    constructor(name, serviceClass, isSingleton, frequency=1)  {
        this.isSingleton = isSingleton === undefined ? true : isSingleton;
        this.name = name;
        this.class = serviceClass;
        this.constructorArgs = [];
        this.methodCalls = [];
        this.frequency = frequency;
        return this;
    }

    /**
     * @constructor
     * @description Add a argument used by the constructor
     * @param {Array|number|string|Boolean|Object} value - the value of the argument
     * @return {ServiceDefinition} this
     */
    addArgument(value) {
        this.constructorArgs.push(value);
        return this;
    }

    /**
     * @constructor
     * @description Add an array of arguments used by the constructor
     * @param {Array} args - the array of arguments
     * @return {ServiceDefinition} this
     */
    addArguments(args) {
        this.constructorArgs = this.constructorArgs.concat(args);
        return this;
    }

    /**
     * @constructor
     * @description Add a method call
     * @param {string} method - the name of the method
     * @param {Array} [args] - the array of method arguments
     * @return {ServiceDefinition} this
     */
    addMethodCall(method, args = []) {
        this.methodCalls.push({
            method,
            args
        });
        return this;
    }

    /**
     * @constructor
     * @description Add an array of method calls
     * @param {Object[]} calls - the array of method calls
     * @param {string} calls[].method - the name of the method
     * @param {Array} calls[].args - the array of method arguments
     * @return {ServiceDefinition} this
     */
    addMethodCalls(calls) {
        this.methodCalls = this.methodCalls.concat(calls);
        return this;
    }

    /**
     * @description get service name 
     * @return {String} this.name - service name 
     */
    getName() {
        return this.name;
    }
}

module.exports = TaskDefinition;
