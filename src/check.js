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
     * @param {HealthCheckAdapter} adapter - check adapter
     */
    constructor(config, adapter) {
        this.state = CHECK_STATES.STOPPED;
        this.adapter = adapter;
        this.interval = makeInterval(config.interval);
        this._intervalID = null;
        this.output = null;
    }

    /**
     * transition to next state
     *
     * @param {string} nextState - state to transition to
     * @param {string|null} nextOutput - adapter output
     */
    transition(nextState, nextOutput = null) {
        this.state = nextState;
        this.output = nextOutput;
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
        let nextOutput;

        try {
            // send heartbeat to adapter
            const { passed, output } = await this.adapter.heartbeat();

            // compute next state
            nextState = passed ? CHECK_STATES.PASSING : CHECK_STATES.FAILED;
            nextOutput = output;

        } catch (err) {
            // err: heartbeat failed
            nextState = CHECK_STATES.FAILED;
            nextOutput = String(err);
        }

        // update state
        this.transition(nextState, nextOutput);
    }
};
