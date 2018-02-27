/**
 * default check interval in ms (1m)
 *
 * @type {number}
 */
module.exports.DEFAULT_CHECK_INTERVAL = 60000;


/**
 * check states
 *
 * @type {{PASSING: string, FAILED: string, INS_DATA: string}}
 */
module.exports.CHECK_STATES = {
    STOPPED: 'STOPPED',
    PENDING: 'PENDING',
    PASSING: 'PASSING',
    FAILED: 'FAILED',
};
