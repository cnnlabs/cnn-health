/*global fetch*/
'use strict';

const status = require('./status'),
    Check = require('./check'),
    util = require('util');

class JsonCheck extends Check {

    constructor(options) {
        super(options);
        this.callback = options.callback;
        this.url = options.url;
        this.checkResultInternal = options.checkResult;
    }

    get checkOutput() {
        return this.checkResultInternal[this.status];
    }

    tick() {
        return fetch(this.url)
            .then((response) => {
                let message;

                if (!response.ok) {
                    message = util.format('BadResponse %s', response.status);
                    throw new Error(message);
                }

                return response.json();
            })
            .then((json) => {
                let result = this.callback(json);
                this.status = result ? status.PASSED : status.FAILED;
            })
            .catch((err) => {
                console.error('Failed to get JSON', err);
                this.status = status.FAILED;
            });
    }
}

module.exports = JsonCheck;

