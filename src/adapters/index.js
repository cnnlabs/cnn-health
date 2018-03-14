/** 
 * adapter registry
 * 
 * @type {object} - map of available adapters
 */
module.exports = {
    custom: require('./custom'),
    json: require('./json')
}