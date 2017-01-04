/*global fetch*/
'use strict';

const status = require('./status'),
    Check = require('./check'),
    util = require('util');

class CustomCheck extends Check {

    constructor(options) {

        super(options);
        this.callback = options.callback;
        this.checkResultInternal = options.checkResult;
        this.tock = options.tick.bind(this);
        this.customStatus = options.getStatus.bind(this);
    }

    get checkOutput() {
        return this.checkResultInternal[this.status];
    }

    tick() {
        return this.tock();
    }

    getStatus() {
        return this.customStatus();
    }
}

module.exports = CustomCheck;

