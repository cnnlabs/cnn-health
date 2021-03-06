const { CHECK_STATUS } = require('./common/constants');
const UTIL = require('./common/utilities');

/**
 * Health Check
 */
module.exports = class Check {
    /**
     * constructor
     *
     * @param {object} config - check settings
     * @param {func|null} onStatusChange - called when status changes with instance of check
     */
    constructor(config, onStatusChange = null) {
        // properties
        this._configure(config);
        this._onStatusChange = onStatusChange;

        // initial runtime state
        this._state = { status: CHECK_STATUS.STOPPED, output: null };
        this._timer = null;
    }

    /**
     * getter to retrieve check name
     *
     * @returns {string} - name of check
     */
    get name() {
        return this.desc.name;
    }

    /**
     * retrieve current state of check
     * @returns {object} - current status,output of check
     */
    get currentState() {
        return this._state;
    }

    /**
     * retrieve check description
     * @returns {object} - description
     */
    get desc() {
        return this._description;
    }

    /**
     * setter for status-change handler
     *
     * @param {func} callback - status-change handler
     */
    set onStatusChange(callback) {
        this._onStatusChange = callback;
    }

    /**
     * runs check on given interval
     */
    start() {
        if (this._timer) return;
        this._transition(CHECK_STATUS.PENDING);
        this._timer = setInterval(this._tick.bind(this), this._interval);
    }

    /**
     * stop running this check
     */
    stop() {
        if (!this._timer) return;
        this._transition(CHECK_STATUS.STOPPED);
        clearInterval(this._timer);
    }

    /**
     * initialize check instance from the given config object
     * 
     * @param {object} config - check configuration
     */
    _configure(config) {
        this._description = UTIL.makeCheckDescription(config.description);
        this._interval = UTIL.makeInterval(config.interval);
        this._adapter = UTIL.makeCheckAdapter(config.type, config.options);
    }

    /**
     * transition to next state
     *
     * @param {string} status - status to transition to
     * @param {string|null} output - adapter output
     * @private
     */
    _transition(status, output = null) {
        // no transition if state hasn't changed
        if (this._state.status === status && this._state.output === output) return;

        // update state
        this._state = {status, output};

        // notify
        if (this._onStatusChange) this._onStatusChange(this);
    }

    /**
     * performs health-check
     *
     * @private
     */
    async _tick() {
        let nextStatus;
        let nextOutput;

        try {
            // send heartbeat to adapter
            const { passed, output } = await this._adapter.heartbeat();

            // compute next state
            nextStatus = passed ? CHECK_STATUS.PASSING : CHECK_STATUS.FAILED;
            nextOutput = output;

        } catch (err) {
            // err: heartbeat failed
            nextStatus = CHECK_STATUS.FAILED;
            nextOutput = String(err);
        }

        // update state
        this._transition(nextStatus, nextOutput);
    }
};
