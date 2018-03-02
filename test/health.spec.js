const { CHECK_STATUS } = require('../src/common/constants');
const Health = require('../src/health');
/**
 * Tests for Health class
 */
describe('Health', () => {
    const mockCheck = jest.mock('../src/check');
    /**
     * constructor()
     */
    describe('constructor()', () => {
        const tests = [
            [],
            [mockCheck]
        ];

        tests.forEach(t => {
            it('should accept a list of check objects', () => {
                const health = new Health(t);
                expect(health).toBeInstanceOf(Health);
                expect(health._checks).toEqual(t);
            });
        });

        it('should be created in the STOPPED state', () => {
            const health = new Health([]);
            expect(health.currentState.status).toBe(CHECK_STATUS.STOPPED);
        });
    });

    /**
     * start()
     */
    describe('start()', () => {

        it('should call start() on each check', () => {
            // mock check start fn
            mockCheck.start = jest.fn();

            // create health
            const health = new Health([mockCheck]);

            // sut
            health.start();

            // assert
            expect(mockCheck.start).toHaveBeenCalledTimes(1);
        });
    });

    /**
     * stop()
     */
    describe('stop()', () => {

        it('should call stop() on each check', () => {
            // mock check stop fn
            mockCheck.stop = jest.fn();

            // create health
            const health = new Health([mockCheck]);

            // sut
            health.stop();

            // assert
            expect(mockCheck.stop).toHaveBeenCalledTimes(1);
        });
    });
});

