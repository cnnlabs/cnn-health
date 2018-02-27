const { CONSTANTS } = require('../../src/common');

/**
 * Tests for package constants
 */
describe('CONSTANTS', () => {

    it('default check interval should be 1m', () => {
        // 60000 ms = 1m
        expect(CONSTANTS.DEFAULT_CHECK_INTERVAL).toBe(60000);
    });

    it('possible check states are PASSING, FAILED, and INS_DATA', () => {
        // map of available states
        const STATES = CONSTANTS.CHECK_STATES;

        // each state should return non-null in map
        ['PASSING', 'FAILING', 'INS_DATA']
            .forEach((s) => expect(STATES[s]).not.toBeNull());
    });
});

