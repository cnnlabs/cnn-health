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

