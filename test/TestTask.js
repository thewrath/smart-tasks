const Task = require('../lib/Task');

class TestTask extends Task {
    constructor(cb){
        super();
        this.cb = cb;
    }
    
    run() {
        if(typeof this.cb === "function"){
            this.cb();
        }
        return true;
    }
}

module.exports = TestTask;