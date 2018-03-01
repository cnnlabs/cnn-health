const { CHECK_STATES } = require('./common/constants');
const { makeInterval, makeDescription } = require('./common/utilities');

/**
 * Health Check
 */
module.exports = class Check {
    /**
     * constructor
     *
     * @param {object} config - check settings
     */
    constructor(config) {
        // properties
        this._description = makeDescription(config.description);
        this._interval = makeInterval(config.interval);
        this._adapter = config.adapter;

        // initial runtime state
        this._state = { status: CHECK_STATES.STOPPED, output: null };
        this._timer = null;
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
     * runs check on given interval
     */
    start() {
        if (this._timer) return;
        this._timer = setInterval(this._tick, this._interval);
        this._transition(CHECK_STATES.PENDING);
    }

    /**
     * stop running this check
     */
    stop() {
        if (!this._timer) return;
        clearInterval(this._timer);
        this._transition(CHECK_STATES.STOPPED);
    }

    /**
     * transition to next state
     *
     * @param {string} status - state to transition to
     * @param {string|null} output - adapter output
     * @private
     */
    _transition(status, output = null) {
        this._state = {status, output};
    }

    /**
     * performs health-check
     *
     * @private
     */
    async _tick() {
        let nextState;
        let nextOutput;

        try {
            // send heartbeat to adapter
            const { passed, output } = await this._adapter.heartbeat();

            // compute next state
            nextState = passed ? CHECK_STATES.PASSING : CHECK_STATES.FAILED;
            nextOutput = output;

        } catch (err) {
            // err: heartbeat failed
            nextState = CHECK_STATES.FAILED;
            nextOutput = String(err);
        }

        // update state
        this._transition(nextState, nextOutput);
    }
};
