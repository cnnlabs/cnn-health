const CheckAdapter = require('../src/adapter');
const Health = require('../src/health');

/**
 * Tests for Health class
 */
describe('Health', () => {
    // mock check adapter
    class MockCheck extends CheckAdapter {}

    /**
     * constructor()
     */
    describe('constructor()', () => {
        const tests = [
            [],
            [new MockCheck]
        ];

        tests.forEach(t => {
            it('should accept a list of check objects', () => {
                const health = new Health(t);
                expect(health).toBeInstanceOf(Health);
                expect(health.checks).toBe(t);
            });
        });
    });

    /**
     * start()
     */
    describe('start()', () => {

        it('should call start() on each check', () => {
            // mock check start fn
            const mockCheck = new MockCheck;
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
            const mockCheck = new MockCheck;
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

