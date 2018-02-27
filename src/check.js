const { makeInterval } = require('./common/utilities');

/**
 * Health Check
 */
module.exports = class Check {
    /**
     * constructor
     *
     * @param {object} config check settings
     */
    constructor(config) {
        this.interval = makeInterval(config.interval);
    }

    /**
     * runs check on given interval
     */
    start() {
        if (!this._intervalID) {
            this._intervalID = setInterval(this._tick, this.interval);
        }
    }

    /**
     * stop running this check
     */
    stop() {
        if (this._intervalID) {
            clearInterval(this._intervalID);
        }
    }

    /**
     * performs health-check
     *
     * @private
     */
    _tick() {}
};
