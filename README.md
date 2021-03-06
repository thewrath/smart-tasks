![alt text](https://github.com/thewrath/smart-tasks/blob/master/bin/logo.png)

[![Build Status](https://travis-ci.org/thewrath/smart-tasks.svg?branch=master)](https://travis-ci.org/thewrath/smart-tasks)
[![DeepScan grade](https://deepscan.io/api/teams/7258/projects/9387/branches/121534/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=7258&pid=9387&bid=121534)
[![Coverage Status](https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_83.svg?branch=master&service=github)](https://coveralls.io/github/thewrath/smart-tasks?branch=master)

# Overview

  smart-tasks is a very simple task manager (container and scheduler) for NodeJS which can be configured with a configuration file.
  The base code comes from the following project : (https://github.com/arkerone/smart-container)

## 🏗️ Installation
```
$ npm install smart-tasks
```

## 🃏 Test

Test are write in `test` folder with the jest framework from Facebook

```
$ npm run test
```

## ✔️ Features
  * Define classes or literal objects to task manager,
  * Define properties to task,
  * Inject container (from smart-container) in task,
  * Setting up tasks with a configuration file,
  * Launch periodic tasks  (define with frequency)
  * single run frequency based task (non-periodic)
  * single run time based task (non-periodic)

## ⚙️ TODO
  * Launch time based tasks (periodic)
  * Move to TypeScript  
  * Add an ID to task (for serialization ...)
  * Add Storage integration to store task on disk and restore it
  
## 🔧 TO FIX 
  * Service injection in task instead of task injection (see : Construct arguments of TaskDefinition of test container.test.js)

## 🤔 TO THINK ABOUT
  * Turn task into promise based object and relaunch it only if the previous one is resolve.
  * Single run task management (remove it from task container or scheduler task history ?)

## 🤖 Usage

### Create and use the task scheduler without configuration file

#### Require  smart-tasks taskContainer and Scheduler 

```js
const st = require('smart-tasks');
```

#### Create taskContainer
```js
const taskContainer = st.TaskContainerBuilder.create();
```

#### Create and register a new task
```js
/* Create a task class */
class Hello extends Task {
  constructor(container) {
    super(container, 10); // smart-container service container for DI 
    this.msg = 'Hello world!';
  }

  async run() {
    console.log(this.msg);
  }
}
/* Be careful to export your class !*/
module.exports = Hello;

/* Register the task */
taskContainer.register('hello', Hello);
```

#### Create task scheduler
```js
const scheduler = st.Scheduler(taskContainer);
scheduler.init();
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
You can use the environment variables:
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
// Init task container with config file
this.taskContainer = TaskContainerBuilder.build(__dirname, 'config/tasks.js', this.servicesContainer);
```
