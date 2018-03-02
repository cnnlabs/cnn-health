const CONSTANTS = require('../../src/common/constants');
const { makeInterval, makeCheckDescription } = require('../../src/common/utilities');

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
            Object.keys(tests).forEach(v => expect(makeInterval(v)).toBe(tests[v]));
        });
    });

    /**
     * makeCheckDescription()
     */
    describe('makeCheckDescription()', () => {
        // create valid desc object
        const mockProps = CONSTANTS.CHECK_DESCRIPTION_PROPERTIES.reduce((map, prop) => {
            map[prop] = 'test';
            return map;
        }, {});

        it('should return a valid description object', () => {
            const desc = makeCheckDescription(mockProps);
            expect(desc).toEqual(mockProps);
        });

        it('should throw error on missing properties', () => {
            const tests = [{}];

            tests.forEach(props => {
                const mkObj = () => makeCheckDescription(props);
                expect(mkObj).toThrow();
            });
        });
    });
});

