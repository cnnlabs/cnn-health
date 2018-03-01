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

/**
 * properties that are required to describe a health-check instance
 *
 * @type {array} - list of required properties
 */
module.exports.CHECK_DESCRIPTION_PROPERTIES = [
    'name',
    'severity',
    'panicGuide',
    'businessImpact',
    'technicalSummary'
];