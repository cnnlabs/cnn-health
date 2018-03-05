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
     * @param {func} onStatusChange - called when status changes with current state
     */
    constructor(checks, onStatusChange = null) {
        // assign status change listener
        this._onStatusChange = onStatusChange;

        // initial state
        this._state = {
            status: CHECK_STATUS.STOPPED,
            healthy: null,
            checks: {}
        };

        // init checks
        this._checks = checks.map(cfg => {
            // create check object
            const check = makeCheck(cfg, this._handleStatusChange.bind(this));

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

        // notify listeners
        if (this._onStatusChange) this._onStatusChange(this._state);
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

