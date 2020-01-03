const SchedulerBuilder = require('../lib/SchedulerBuilder.js');
const ContainerBuilder = require('smart-container');
const TestTask = require('./TestTask.js');

test('Manual scheduler task creation', () => {
    let scheduler = SchedulerBuilder.create();
    let taskName = 'test_task';
    scheduler.register(taskName, TestTask);
    expect(scheduler.get(taskName)).toBeInstanceOf(TestTask);
});

test('Manual scheduler with container', () => {
    let scheduler = SchedulerBuilder.create();
    let servicesContainer = ContainerBuilder.create();
    scheduler.setContainer(servicesContainer);
    expect(scheduler.getContainer()).toBe(servicesContainer);
});

test('Manual scheduler task not found error', () => {
    let scheduler = SchedulerBuilder.create();
    let taskName = 'none';
    expect(() => {
        scheduler.get(taskName);
    }).toThrowError(`No task "${taskName}" available`);
});

test('Configuration js file scheduler creation', () => {
    let scheduler = SchedulerBuilder.build(__dirname, './tasks-configurations.js');
    let taskName = "test_task";
    expect(scheduler.get(taskName)).toBeInstanceOf(TestTask)

});

test('Configuration json file scheduler creation not found error', () => {
    //with wrong file 
    expect(() => {
       SchedulerBuilder.build(__dirname, './not_found_configuration.js'); 
    }).toThrowError("Configuration file not found");
});

test('Configuration file scheduler creation with container', () => {
    let servicesContainer = ContainerBuilder.create();
    let scheduler = SchedulerBuilder.build(__dirname, './tasks-configurations.js', servicesContainer);
    expect(scheduler.getContainer()).toBe(servicesContainer);
});

jest.useFakeTimers();
let schedulerIntervalFake = jest.fn().mockImplementation(() => {
    return true;
});

test('Scheduler timer', () => {
    let scheduler = SchedulerBuilder.create();
    let task = new TestTask(schedulerIntervalFake);
    let taskName = "test_task";
    task.frequency = 1; 
    scheduler.register(taskName, task);
    expect(scheduler.get(taskName)).toBeInstanceOf(TestTask);
    scheduler.run(1);
    jest.runOnlyPendingTimers();
    expect(schedulerIntervalFake).toBeCalled();
});

test('Single run task', () => {
    let scheduler = SchedulerBuilder.create();
    let task = new TestTask(schedulerIntervalFake);
    let taskName = "test_task";
    task.frequency = 1;
    task.singleRun = true;
    scheduler.register(taskName, task);
    expect(scheduler.get(taskName)).toBeInstanceOf(TestTask);
    expect(scheduler.getTasks()[taskName]).toBeInstanceOf(TestTask);
    scheduler.run(1);
    jest.runOnlyPendingTimers();
    expect(schedulerIntervalFake).toBeCalled();
    expect(scheduler.getTasks()[taskName]).toBeUndefined();
});