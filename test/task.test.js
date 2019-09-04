const Task = require('../lib/Task');

class TaskExtend extends Task{
    run() {
        return "TaskExtend" 
    } 
}

test('task creation', () => {
    let task = new Task();
    expect(task.run()).toBe(true)
});

test('task extend', () => {
    let task = new TaskExtend()
    expect(task.run()).toBe("TaskExtend")
});

