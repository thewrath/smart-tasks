"use strict";
const path = require('path');

module.exports = {
    tasks: {
        test_task: {
            path: path.join(__dirname, 'TestTask.js'),
            frequency: 900,
            singleRun: true
        },

        test2_task: {
            path: path.join(__dirname, 'TestTask.js'),
            frequency: 900,
            singleRun: false
        }
    }
};