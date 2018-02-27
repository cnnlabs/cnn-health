const CONSTANTS = require('../src/constants');
const { makeInterval } = require('../src/utilities');

/**
 * Tests for utility functions
 */
describe('UTILITIES', () => {
    /**
     * makeInterval()
     */
    describe('makeInterval()', () => {

        it('should fallback to DEFAULT_CHECK_INTERVAL', () => {
            expect(makeInterval(null)).toBe(CONSTANTS.DEFAULT_CHECK_INTERVAL);
        });

        it('should use number if one is provided', () => {
            const value = 60000;

            expect(makeInterval(value)).toBe(value);
        });

        it('should convert string representation to number', () => {
            // string to value map of tests
            const tests = {
                '1m': 60000,
                '1h': (60000 * 60)
            };

            // compare result to value from map
            Object.keys(tests).map((v) => expect(makeInterval(v)).toBe(tests[v]));
        });
    });
});

