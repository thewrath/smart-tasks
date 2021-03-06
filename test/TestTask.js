const Task = require('../lib/index').Task;

class TestTask extends Task {
    constructor(cb){
        super();
        this.cb = cb;
    }
    
    async run() {
        if(typeof this.cb === "function"){
            this.cb();
        }
        return true;
    }
}

module.exports = TestTask;