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
     * run health check for this adapter
     *
     * @throws Error when missing concrete implementation
     * @abstract
     */
    runCheck() {
        throw new Error('runCheck() must be implemented by adapter class.')
    }
};

