const CONSTANTS = require('./constants');
const ADAPTERS = require('../adapters');
const Check = require('../check');
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

/**
 * creates object to describe a single instance of a health-check
 *
 * @param {object} desc - description
 * @return {object} - validated description
 * @throws {Error} - on invalid description object
 */
module.exports.makeCheckDescription = function(desc) {
    // throw err on missing properties
    const existingKeys = Object.keys(desc);
    const missingProperties = CONSTANTS.CHECK_DESCRIPTION_PROPERTIES.filter(p => !existingKeys.includes(p));

    if (missingProperties.length) {
        throw new Error(`check-description is missing properties (${missingProperties.join(', ')}) for check ${desc.name}`);
    }

    return desc;
};

/**
 * creates check-object from config
 *
 * @param {object} config - check configuration
 * @returns {Check} - check object
 */
module.exports.makeCheck = function(config) {
    return (config instanceof Check) ? config : new Check(config);
};

/**
 * creates check adapter
 *
 * @param {string} type - adapter type
 * @param {object|null} options - adapter options
 */
module.exports.makeCheckAdapter = function(type, options = {}) {
    // guard against invalid adapter type
    if (!ADAPTERS.hasOwnProperty(type)) throw new Error(`Adapter of type '${type}' not found.`);

    // create adapter with given options
    return new ADAPTERS[type](options);
};
