/*global fetch*/
'use strict';
require('isomorphic-fetch');
const health = require('../main'),
    path = require('path'),
    util = require('util'),
    customCheck = require('./lib/customcheck/custom.check'),
    tests = {
        BASICCHECK: 'BASIC',
        CLASSCHECK: 'CLASSCHECK',
        CONFIGCHECK: 'CONFIGCHECK'
    };


let healthchecks = health(path.resolve(__dirname, './config')).asArray(),
    theCheck;


// Basic health check using basic health check plugins
function test() {
    let checks = healthchecks.map((check) => {
        return check.getStatus();
    });

    console.log(checks);
}

/**
*Custom health check using our own class that extends Check
*/
function setUpCustomClassCheck() {
    let config = {
        name: 'CUSTOM CLASS Check for CNN Homepage',
        severity: 2,
        businessImpact: 'Its a HUGE deal',
        technicalSummary: 'god knows',
        panicGuide: 'Don\'t Panic',
        interval: '10s'
    };

    theCheck = health.runCustomCheckClass(customCheck, config);
    //TODO  modify health.runCustomCheck to supports running multiple custom check classes

}

/**
*Configures a custom health checks using a config object
*/
function customHealthCheckConfig() {
    let config = {
        name: 'Custom Config Checks App Called Test',
        description: 'json check fixture description',
        checks: [
            {
                type: 'custom',
                name: 'Custom Check some dependency 1 for App Called Test',
                url: 'http://www.cnn.com/_healthcheck',
                severity: 2,
                businessImpact: 'Its a HUGE deal',
                technicalSummary: 'god knows',
                panicGuide: 'Don\'t Panic',
                checkResult: {
                    PASSED: 'Text if check passed',
                    FAILED: 'Text is check failed',
                    PENDING: 'This check has not yet run'
                },
                interval: '10s',
                callback: function (json) {
                    return json.version;
                },
                tick: function () {
                    return fetch('http://www.cnn.com/_healthcheck')
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
                            this.status = result ? this.stateValues.PASSED : this.stateValues.FAILED;
                        })
                        .catch((err) => {
                            console.error('Failed to get JSON', err);
                            this.status = this.checkResultInternal.FAILED;
                        });
                },
                getStatus: function () {
                    const output = {
                        name: this.name,
                        ok: this.status === this.checkResultInternal.PASSED,
                        severity: this.severity,
                        businessImpact: this.businessImpact,
                        technicalSummary: this.technicalSummary,
                        panicGuide: this.panicGuide,
                        checkOutput: this.checkOutput()

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
            // {
            //     type: 'mongo',
            //     name: 'database',
            //     collection: 'users',
            //     severity: 2,
            //     businessImpact: 'Its a HUGE deal',
            //     technicalSummary: 'god knows',
            //     panicGuide: 'Don\'t Panic',
            //     checkResult: {
            //         PASSED: 'Text if check passed',
            //         FAILED: 'Text is check failed',
            //         PENDING: 'This check has not yet run'
            //     },
            //     interval: '10s'
            // }
        ]
    };

    return config;
}

/**
*Custom health check config
*/
function setUpCustomerConfigCheck() {
    theCheck = health.runCustomCheck(customHealthCheckConfig());
}



function runCheckGetStatus() {
    console.log(theCheck.getStatus());
}


function testRunner(type) {

    if (type === tests.BASICCHECK) {
        setInterval(test, 2000);
    } else if (type === tests.CLASSCHECK) {
        /*custom check extending Check class*/
        setUpCustomClassCheck();
        setInterval(runCheckGetStatus, 2000);
    } else if (type === tests.CONFIGCHECK) {
        /* customer check for Check Config*/
        setUpCustomerConfigCheck();
        setInterval(runCheckGetStatus, 2000);
    }
}

//testRunner(tests.BASICCHECK);
//testRunner(tests.CLASSCHECK);
testRunner(tests.CONFIGCHECK);


