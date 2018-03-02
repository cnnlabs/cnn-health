const { CHECK_STATUS } = require('./common/constants');
/**
 * Health
 * health-check runner
 */
module.exports = class Health {
    /**
     * constructor
     *
     * @param {array} checks - healthchecks
     */
    constructor(checks) {
        this.checks = checks;

        // initial state
        this._state = {
            status: CHECK_STATUS.STOPPED,
            healthy: null,
            checks: []
        };
    }

    /**
     * retrieve current state of all health-checks
     *
     * @returns {object} - current state
     */
    get status() {
        return this._state;
    }

    /**
     * start running all configured checks
     */
    start() {
        this.checks.forEach(c => c.start());
    }

    /**
     * stop running all configured checks
     */
    stop() {
        this.checks.forEach(c => c.stop());
    }
};

