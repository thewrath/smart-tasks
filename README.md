# smart-tasks

  smart-tasks is a task manager for NodeJS which can be configured with a configuration file.
  The base code comes from the following project : (https://github.com/arkerone/smart-container)

## Installation
```
$ npm install --save smart-tasks
```

## Features

  * Define classes or literal objects to task manager,
  * Define properties to task,
  * Inject container (from smart-container) in task,
  * Setting up tasks with a configuration file,
  * Launch periodic tasks  

## TODO
 * Launch non-periodic tasks
 * Remove useless part come from smart-container

## Usage

### Create and use the container without configuration file

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
/* Create a service class */
class Hello {
  constructor() {
    this.msg = 'Hello world!';
  }

  sayHello() {
    console.log(this.msg);
  }
}

/* Register the service */
scheduler.register('hello', Hello);
```

### The configuration file
Here is a template of a service configuration file (the file can be a JSON or a JS file) :

```js
"use strict";
import path from "path";

module.exports = {
    properties: {
        message: 'This message was transformed in uppercase'
    },
    tasks: {
        presence_check: {
            path: path.join(__dirname, '../tasks/PresenceCheckTask.js'),
            frequency: 30 //every 30 s 
        },
        fetch_order: {
            path: path.join(__dirname, '../tasks/FetchOrderTask.js'),
            frequency: 30 //every 30 s  
        }
    }
};
```
##### process.env support
If you use a js configuration file instead of a JSON configuration file, you can use the environment variables:
```js
{
  properties: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS
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

You can, like the arguments of the `constuctor`, make a reference to a property or a service.
