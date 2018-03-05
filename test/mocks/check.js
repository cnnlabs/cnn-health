const Check = require('../../src/check');
/** 
 * Mock Check Object
 */
module.exports = class MockCheck extends Check {
    /**
     * creates mock with given name and state
     *
     * @param {string} name - mock name
     * @param {object} state - mock state
     */
    constructor(name, state) {
        super({});
        this._description = {name};
        this._state = state;
    }

    // NO_OP: disable configuration on mock
    _configure(config) {}
}