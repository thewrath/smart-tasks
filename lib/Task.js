const TaskError = require('./TaskError');

/**
 * @author thewrath
 */

class Task {
  constructor(container, frequency, date) {
    this.container = container;
    this.frequency = frequency;
    this.date = date;
    this.singleRun = false;
  }

  async run() {
    throw new TaskError('Run method in task not implemented', this);
  }
}

module.exports = Task;
