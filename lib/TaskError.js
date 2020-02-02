/**
 * @author thewrath
 */

class TaskError {
  constructor(message, task) {
    this.message = `${message}, see : ${task}`;
    this.name = 'TaskError';
    this.task = task;
  }
}

module.exports = TaskError;
