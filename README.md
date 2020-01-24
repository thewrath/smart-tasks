# 🕑 Smart-tasks

  smart-tasks is a task manager for NodeJS which can be configured with a configuration file.
  The base code comes from the following project : (https://github.com/arkerone/smart-container)

## 🏗️ Installation
```
$ npm install --save smart-tasks
```

## 🃏 Test

Test are write in `test` folder with the jest framework from Facebook

```
$ npm test
```

## ✔️ Features
  * Define classes or literal objects to task manager,
  * Define properties to task,
  * Inject container (from smart-container) in task,
  * Setting up tasks with a configuration file,
  * Launch periodic tasks  (define with frequency)
  * single run frequency based task (non-periodic)

## ⚙️ TODO
  * single run time based task (non-periodic)
  * Launch time based tasks (periodic)
  * Remove useless part come from smart-container
  * Move to TypeScript 
  * Surround task execution by try-catch to prevent undefined function error 

## 🤖 Usage

### Create and use the task scheduler without configuration file

#### Create new smart-tasks scheduler
```js
const schedulerBuilder = require('smart-tasks');
```

#### Create the scheduler
```js
const scheduler = schedulerBuilder.create();
```

#### Create and register a new task
```js
/* Create a task class */
class Hello extends Task {
  constructor(container) {
    super(container, 10); // smart-container service container for DI 
    this.msg = 'Hello world!';
  }

  run() {
    console.log(this.msg);
  }
}
/* Be careful to export your class !*/
module.exports = Hello;

/* Register the task */
scheduler.register('hello', Hello);
```

#### Build tasks and run the scheduler
```js
scheduler.buildAllTasks();
scheduler.run(1000, null);
```

### The configuration file
Here is a template of a task configuration file `tasks.js`:

```js
"use strict";
import path from "path";

module.exports = {
    tasks: {
        presence_check: {
            path: path.join(__dirname, '../tasks/PresenceCheckTask.js'),
            frequency: 30 // frequency depend on the loop timeout
        },
        fetch_order: {
            path: path.join(__dirname, '../tasks/FetchOrderTask.js'),
            frequency: 30 // frequency depend on the loop timeout 
        }
    }
};
```
##### process.env support
If you use a js configuration file , you can use the environment variables:
```js
{
  properties: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS
  },

  tasks: {
        presence_check: {
            path: path.join(__dirname, '../tasks/PresenceCheckTask.js'),
            frequency: 30, // frequency depend on the loop timeout
            constructorArgs: ['%host%', '%username%']
        },
        fetch_order: {
            path: path.join(__dirname, '../tasks/FetchOrderTask.js'),
            frequency: 30 // frequency depend on the loop timeout 
        }
    }
}
```
#### The task
##### The name and path of the task
The object `tasks` is used to define a collection of tasks. For each task, you must specify its name and the path of its file :
```js
{
  tasks: {
    messagePrinter: {
      path: './MessagePrinter'
    }
  }
}
```
##### constructorArgs
you can specify the arguments of the task `constructor` :
```js
{
  tasks: {
    messagePrinter: {
      path: './MessagePrinter',
      constructorArgs: ['Hello world!']
    }
  }
}
```
### Dependency injection

You can use smart-container container to inject services inside task
```js
this.servicesContainer = ContainerBuilder.build(__dirname, 'config/services.js');
// Init task scheduler with config file
this.tasksScheduler = SchedulerBuilder.build(__dirname, 'config/tasks.js', this.servicesContainer);
```
