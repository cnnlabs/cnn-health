const CONSTANTS = require('./constants');
const ms = require('ms');

/**
 * creates interval from string or numerical value
 * fallback to DEFAULT_CHECK_INTERVAL
 *
 * @param {string|number} value - value to convert
 * @return {*} - interval
 */
module.exports.makeInterval = function (value) {
    return (typeof value === 'string') ? ms(value) : (value || CONSTANTS.DEFAULT_CHECK_INTERVAL);
};
