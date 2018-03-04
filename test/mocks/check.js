const Check = require('../../src/check');
/** 
 * Mock Check Object
 */
module.exports = class MockCheck extends Check {
    // NO_OP: disable configuration on mock
    _configure(config) {}
}