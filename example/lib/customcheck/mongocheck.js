'use strict';
const Check = require('../../../lib/plugins/checks/check'),
    status =  require('../../../lib/plugins/checks/status'),
    debug = require('debug')('cnn-health:example:lib:mongocheck');

class mongoCheck extends Check {

    constructor (options) {
        super(options);

    }

    get checkOutput () {
        switch (this.status) {
            case status.PENDING:
                return 'This check has not yet run';
            case status.PASSED:
                return 'Mongo query returned data successfully';
            default:
                return 'Mongo query did not return data successfully';
        }
    }

    tick () {
        return new Promise((fulfill, reject) =>{
            this.status = status.PASSED;
            this.lastUpdated = new Date();
            debug(this.lastUpdated)
            fulfill();
        });
    }
}

module.exports = mongoCheck;
