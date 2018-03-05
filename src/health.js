const { CHECK_STATUS } = require('./common/constants');
const { makeCheck} = require('./common/utilities');
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
        // initial state
        this._state = {
            status: CHECK_STATUS.STOPPED,
            healthy: null,
            checks: {}
        };

        // init checks
        this._checks = checks.map(cfg => {
            // create check object
            const check = makeCheck(cfg, this._handleStatusChange);

            // record initial state
            this._state[check.name] = check.currentState;

            return check;
        });
    }

    /**
     * react to status updates from running checks
     *
     * @param {object} check - check status to record
     */
    _handleStatusChange(check) {
        // record check status
        this._state[check.name] = check.currentState;
    }

    /**
     * retrieve current state of all health-checks
     *
     * @returns {object} - current state
     */
    get currentState() {
        return this._state;
    }

    /**
     * start running all configured checks
     */
    start() {
        this._checks.forEach(c => c.start());
    }

    /**
     * stop running all configured checks
     */
    stop() {
        this._checks.forEach(c => c.stop());
    }
};

