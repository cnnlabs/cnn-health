/**
 * default check interval in ms (1m)
 *
 * @type {number} - default interval
 */
module.exports.DEFAULT_CHECK_INTERVAL = 60000;

/**
 * check states
 *
 * @type {object} - possible states for a given check
 */
module.exports.CHECK_STATES = {
    STOPPED: 'STOPPED',
    PENDING: 'PENDING',
    PASSING: 'PASSING',
    FAILED: 'FAILED',
};
