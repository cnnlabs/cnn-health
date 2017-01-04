'use strict';
const Check = require('../../../lib/plugins/checks/check'),
    status =  require('../../../lib/plugins/checks/status'),
    debug = require('debug')('cnn-health:example:lib:customCheck');

class CustomCheck extends Check {

    constructor (options) {
        super(options);
        this.name = options.name || 'unknown app'

    }

    callback (json) {
        console.log(json.version);
        return json.version;
    }

    get checkOutput () {
        switch (this.status) {
            case status.PENDING:
                return 'This check has not yet run';
            case status.PASSED:
                return 'Custom check returned data successfully';
            default:
                return 'Custom check did not return data successfully';
        }
    }

    tick () {
        return new Promise((fulfill, reject) =>{
                fetch('http://www.cnn.com/_healthcheck')
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
                    this.status = result ? status.PASSED: status.FAILED;
                    fulfill();

                })
                .catch((err) => {
                    console.error('Failed to get JSON', err);
                    this.status = status.FAILED;
                    fulfill();
                });
        });
    }

    getStatus () {
        const output = {
            name: this.name,
            ok: this.status === status.PASSED,
            severity: this.severity,
            businessImpact: this.businessImpact,
            technicalSummary: this.technicalSummary,
            panicGuide: this.panicGuide,
            checkOutput: this.checkOutput

        };
        if (this.lastUpdated) {
            output.lastUpdated = this.lastUpdated.toISOString();
            let shouldHaveRun = Date.now() - (this.interval + 1000);
            if (this.lastUpdated.getTime() < shouldHaveRun) {
                output.ok = false;
                output.checkOutput = 'Check has not run recently';
            }
        }
        return output;
    }
}

module.exports = CustomCheck;
