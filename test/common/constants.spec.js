const CONSTANTS = require('../../src/common/constants');

/**
 * Tests for package constants
 */
describe('CONSTANTS', () => {

    it('default check interval should be 1m', () => {
        // 60000 ms = 1m
        expect(CONSTANTS.DEFAULT_CHECK_INTERVAL).toBe(60000);
    });

    it('possible check statuses are STOPPED, PENDING, PASSING, and FAILED', () => {
        // map of available states
        const STATUSES = CONSTANTS.CHECK_STATUS;

        // each state should return non-null in map
        ['STOPPED', 'PENDING', 'PASSING', 'FAILED']
            .forEach((s) => expect(STATUSES[s]).not.toBeNull());
    });
});

