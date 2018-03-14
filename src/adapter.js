/**
 * Base health-check adapter class
 * Concrete health-checks should inherit from this type
 *
 * @abstract
 */
module.exports = class HealthCheckAdapter {
    /**
     * constructor
     *
     * @param {object} options adapter options
     */
    constructor(options) {
        this.options = options;
    }

    /**
     * creates heartbeat object 
     * 
     * @param {boolean} isPassing - did the check pass
     * @param {string} output - adapter output
     * @returns {object} - heartbeat object
     */
    hb(isPassing, output = null) {
        return {
            passed: !!isPassing,
            output: output ? String(output) : null
        };
    }

    /**
     * run health check for this adapter
     *
     * @throws Error when missing concrete implementation
     * @returns {object} - heartbeat object
     * @abstract
     */
    async heartbeat() {
        throw new Error('execute() must be implemented by adapter class.');
    }
};

