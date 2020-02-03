const Task = require('./Task');
/**
 * @author thewrath
 */

class TaskError {
  constructor(message, task) {
    if(!(task instanceof Task)) {
      throw new Error('task argument need to be instance of Task');
    }
    this.message = `${message}, see : ${task.constructor.name}`;
    this.name = 'TaskError';
    this.task = task;
  }
}

module.exports = TaskError;
