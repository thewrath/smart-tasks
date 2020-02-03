const st = require('../lib/index');
const ContainerBuilder = require('smart-container');
const TestTask = require('./TestTask');

test('Build task container and fill it', () => {
    let container = new st.Container()
    container.register('new Task', new TestTask());
    expect(container.get('new Task')).toBeInstanceOf(TestTask);
    expect(container.hasTask('new Task')).toBe(true);
    expect(container.hasTask('Not registred task')).toBe(false);
});

test('Build task container with builder', () => {
    let container = st.ContainerBuilder.build('', '', null);
    expect(container).toBeInstanceOf(st.Container);
    expect(container.getContainer()).toBeNull();
    let servicesContainer = ContainerBuilder.create();
    container.setContainer(servicesContainer);
    expect(container.getContainer()).toBeInstanceOf(servicesContainer.constructor)
});

test('Construct arguments of TaskDefinition', () => {
    let container = st.ContainerBuilder.create();
    let allReadyRegistredTask = new TestTask();
    container.register('allReadyRegistredTask', allReadyRegistredTask);
    const constructorArgs = ["test", "@allReadyRegistredTask"];
    let taskDefinition = new st.TaskDefinition('test', 'null', false, 100, false).addArguments(constructorArgs);
    expect(container.constructArguments(taskDefinition.constructorArgs)[0]).toBe('test');
    expect(container.constructArguments(taskDefinition.constructorArgs)[1]).toBeInstanceOf(TestTask);
});

test('Container custom argument', () => {
    let container = st.ContainerBuilder.create();
    container.addProperty('test', true);
    expect(container.hasProperty('test')).toBe(true);
    expect(container.getProperty('test')).toBe(true);
});

test('Task definition custom construction', () => {
    let taskDefinition = new st.TaskDefinition('test', null, false, 10, false);
    taskDefinition.addArgument('test');
    expect(taskDefinition.constructorArgs).toContain('test');
    taskDefinition.addMethodCall('test', []);
    console.log(taskDefinition.methodCalls);
    expect(taskDefinition.methodCalls[0]).toStrictEqual({"args": [], "method": "test"})
});
