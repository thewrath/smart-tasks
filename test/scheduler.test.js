const ContainerBuilder = require('smart-container');
const st = require('../lib/index.js');
const TestTask = require('./TestTask.js');

test('Manual taskContainer creation', () => {
    let taskContainer = st.ContainerBuilder.create();
    let taskName = 'test_task';
    taskContainer.register(taskName, TestTask);
    expect(taskContainer.get(taskName)).toBeInstanceOf(TestTask);
});

test('Manual taskContainer with service container', () => {
    let taskContainer = st.ContainerBuilder.create();
    let servicesContainer = ContainerBuilder.create();
    taskContainer.setContainer(servicesContainer);
    expect(taskContainer.getContainer()).toBe(servicesContainer);
});

test('Manual taskContainer task not found error', () => {
    let taskContainer = st.ContainerBuilder.create();
    let taskName = 'none';
    expect(() => {
        taskContainer.get(taskName);
    }).toThrowError(`No task "${taskName}" available`);
});

test('Configuration js file taskContainer creation', () => {
    let taskContainer = st.ContainerBuilder.build(__dirname, './tasks-configurations.js');
    let taskName = "test_task";
    expect(taskContainer.get(taskName)).toBeInstanceOf(TestTask)

});

test('Configuration json file taskContainer creation not found error', () => {
    //with wrong file 
    expect(() => {
        st.ContainerBuilder.build(__dirname, './not_found_configuration.js'); 
    }).toThrowError("Configuration file not found");
});

test('Configuration file taskContainer creation with services container', () => {
    let servicesContainer = ContainerBuilder.create();
    let taskContainer = st.ContainerBuilder.build(__dirname, './tasks-configurations.js', servicesContainer);
    expect(taskContainer.getContainer()).toBe(servicesContainer);
});

jest.useFakeTimers();
let schedulerIntervalFake = jest.fn().mockImplementation(() => {
    return true;
});

test('Scheduler run loop', () => {
    let taskContainer = st.ContainerBuilder.create();
    let task = new TestTask(schedulerIntervalFake);
    let taskName = "test_task";
    task.frequency = 1; 
    taskContainer.register(taskName, task);
    expect(taskContainer.get(taskName)).toBeInstanceOf(TestTask);
    
    let scheduler = new st.Scheduler(taskContainer);
    scheduler.init();
    scheduler.run(1);
    jest.runOnlyPendingTimers();
    expect(schedulerIntervalFake).toBeCalled();
});

test('Single run task', () => {
    let taskContainer = st.ContainerBuilder.create();
    let task = new TestTask(schedulerIntervalFake);
    let taskName = "test_task";
    task.frequency = 1;
    task.singleRun = true;
    taskContainer.register(taskName, task);
    expect(taskContainer.get(taskName)).toBeInstanceOf(TestTask);
    expect(taskContainer.getTasks()[taskName]).toBeInstanceOf(TestTask);
    
    
    let scheduler = new st.Scheduler(taskContainer);
    scheduler.init();
    scheduler.run(1);
    jest.runOnlyPendingTimers();
    expect(schedulerIntervalFake).toBeCalled();

    expect(taskContainer.getTasks()[taskName]).toBeUndefined();
});


test('Run date based task', () => {
    let taskContainer = st.ContainerBuilder.create();
    let taskNow = new TestTask(schedulerIntervalFake);
    let taskNowName = "test_task_now";
    taskNow.frequency = undefined;
    taskNow.date = Date.now();
    taskNow.singleRun = true;
    taskContainer.register(taskNowName, taskNow);
    expect(taskContainer.get(taskNowName)).toBeInstanceOf(TestTask);
    expect(taskContainer.getTasks()[taskNowName]).toBeInstanceOf(TestTask);
    
    let taskLate = new TestTask(schedulerIntervalFake);
    let taskLateName = "test_task_late";
    taskLate.frequency = undefined;
    taskLate.date = (new Date()).setFullYear((new Date()).getFullYear() + 1);
    taskLate.singleRun = true;
    taskContainer.register(taskLateName, taskLate);
    expect(taskContainer.get(taskLateName)).toBeInstanceOf(TestTask);
    expect(taskContainer.getTasks()[taskLateName]).toBeInstanceOf(TestTask);
    
    let scheduler = new st.Scheduler(taskContainer);
    scheduler.init();
    scheduler.run(1);
    jest.runOnlyPendingTimers();
    expect(schedulerIntervalFake).toBeCalled();

    expect(taskContainer.getTasks()[taskNowName]).toBeUndefined();
    expect(taskContainer.getTasks()[taskLateName]).toBeDefined();
});