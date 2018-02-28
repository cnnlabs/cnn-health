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
        let nextState;

        try {
            const { passed } = await this.adapter.heartbeat();
            nextState = passed ? CHECK_STATES.PASSING : CHECK_STATES.FAILED;

        } catch (err) {
            nextState = CHECK_STATES.FAILED;
        }

        this.transition(nextState);
    }
};
