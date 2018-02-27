const { makeInterval } = require('./common/utilities');
const { CHECK_STATES } = require('./common/constants');

/**
 * Health Check
 */
module.exports = class Check {
    /**
     * constructor
     *
     * @param {object} config - check settings
     */
    constructor(config, adapter) {
        this.state = CHECK_STATES.STOPPED;
        this.adapter = adapter;
        this.interval = makeInterval(config.interval);
        this._intervalID = null;
    }

    /**
     * transition to next state
     *
     * @param {string} nextState - state to transition to
     */
    transition(nextState) {
        this.state = nextState;
    }

    /**
     * runs check on given interval
     */
    start() {
        if (this._intervalID) return;
        this._intervalID = setInterval(this._tick, this.interval);
        this.transition(CHECK_STATES.PENDING);
    }

    /**
     * stop running this check
     */
    stop() {
        if (!this._intervalID) return;
        clearInterval(this._intervalID);
        this.transition(CHECK_STATES.STOPPED);
    }

    /**
     * performs health-check
     *
     * @private
     */
    async _tick() {
        // run check
        const checkResponse = await this.adapter.runCheck();
        const nextState = checkResponse.passed ? CHECK_STATES.PASSED : CHECK_STATES.FAILED;
        this.transition(nextState);
    }
};
