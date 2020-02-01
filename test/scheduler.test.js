const TaskContainerBuilder = require('../lib/TaskContainerBuilder.js');
const Scheduler = require('../lib/Scheduler.js');
const ContainerBuilder = require('smart-container');
const TestTask = require('./TestTask.js');

test('Manual taskContainer creation', () => {
    let taskContainer = TaskContainerBuilder.create();
    let taskName = 'test_task';
    taskContainer.register(taskName, TestTask);
    expect(taskContainer.get(taskName)).toBeInstanceOf(TestTask);
});

test('Manual taskContainer with service container', () => {
    let taskContainer = TaskContainerBuilder.create();
    let servicesContainer = ContainerBuilder.create();
    taskContainer.setContainer(servicesContainer);
    expect(taskContainer.getContainer()).toBe(servicesContainer);
});

test('Manual taskContainer task not found error', () => {
    let taskContainer = TaskContainerBuilder.create();
    let taskName = 'none';
    expect(() => {
        taskContainer.get(taskName);
    }).toThrowError(`No task "${taskName}" available`);
});

test('Configuration js file taskContainer creation', () => {
    let taskContainer = TaskContainerBuilder.build(__dirname, './tasks-configurations.js');
    let taskName = "test_task";
    expect(taskContainer.get(taskName)).toBeInstanceOf(TestTask)

});

test('Configuration json file taskContainer creation not found error', () => {
    //with wrong file 
    expect(() => {
       TaskContainerBuilder.build(__dirname, './not_found_configuration.js'); 
    }).toThrowError("Configuration file not found");
});

test('Configuration file taskContainer creation with services container', () => {
    let servicesContainer = ContainerBuilder.create();
    let taskContainer = TaskContainerBuilder.build(__dirname, './tasks-configurations.js', servicesContainer);
    expect(taskContainer.getContainer()).toBe(servicesContainer);
});

jest.useFakeTimers();
let schedulerIntervalFake = jest.fn().mockImplementation(() => {
    return true;
});

test('Scheduler run loop', () => {
    let taskContainer = TaskContainerBuilder.create();
    let task = new TestTask(schedulerIntervalFake);
    let taskName = "test_task";
    task.frequency = 1; 
    taskContainer.register(taskName, task);
    expect(taskContainer.get(taskName)).toBeInstanceOf(TestTask);
    
    let scheduler = new Scheduler(taskContainer);
    scheduler.init();
    scheduler.run(1);
    jest.runOnlyPendingTimers();
    expect(schedulerIntervalFake).toBeCalled();
});

test('Single run task', () => {
    let taskContainer = TaskContainerBuilder.create();
    let task = new TestTask(schedulerIntervalFake);
    let taskName = "test_task";
    task.frequency = 1;
    task.singleRun = true;
    taskContainer.register(taskName, task);
    expect(taskContainer.get(taskName)).toBeInstanceOf(TestTask);
    expect(taskContainer.getTasks()[taskName]).toBeInstanceOf(TestTask);
    
    
    let scheduler = new Scheduler(taskContainer);
    scheduler.init();
    scheduler.run(1);
    jest.runOnlyPendingTimers();
    expect(schedulerIntervalFake).toBeCalled();

    expect(taskContainer.getTasks()[taskName]).toBeUndefined();
});