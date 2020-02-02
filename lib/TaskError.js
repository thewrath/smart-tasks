/**
 * @author thewrath
 */

class TaskError {
  constructor(message, task) {
    this.message = `${message}, see : ${task}`;
    this.name = 'TaskError';
    this.task = task;
  }

  get name() {
    return this.name;
  }

  get task() {
    return this.task;
  }
}

module.exports = TaskError;
