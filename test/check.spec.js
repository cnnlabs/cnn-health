const { CHECK_STATES } = require('../src/common/constants');
const Check = require('../src/check');

/**
 * Tests for Check class
 */
describe('Check', () => {
    const mockConfig = { interval: 60000 };

    /**
     * constructor
     */
    describe('constructor()', () => {

        it('should convert given check interval', () => {
            const tests = {
                '1m': 60000,
                60: 60
            };

            Object.keys(tests).map(testValue => {
                const check = new Check({interval: testValue});
                expect(check.interval).toBe(tests[testValue]);
            });
        });

        it('should be created in the STOPPED state', () => {
            const check = new Check(mockConfig);

            expect(check.state).toBe(CHECK_STATES.STOPPED);
        });
    });

    /**
     * start()
     */
    describe('start()', () => {

        it('should call setInterval with interval', () => {
            const check = new Check(mockConfig);

            // mock timers
            jest.useFakeTimers();

            // sut
            check.start();

            // assert
            expect(check.state).toBe(CHECK_STATES.PENDING);
            expect(setInterval).toHaveBeenCalledTimes(1);
            expect(setInterval).toHaveBeenLastCalledWith(
                expect.any(Function),
                mockConfig.interval
            );
        });

        it('should not setInterval when running', () => {
            const check = new Check(mockConfig);

            // mock timers
            jest.useFakeTimers();

            // sut : two calls should result in one setInterval
            check.start();
            check.start();

            // assert
            expect(setInterval).toHaveBeenCalledTimes(1);
        });
    });

    /**
     * stop()
     */
    describe('stop()', () => {
        const intervalID = 42;

        it('should call clearInterval with interval ID', () => {
            const check = new Check(mockConfig);

            // mock timers
            jest.useFakeTimers();
            setInterval.mockReturnValue(intervalID);

            // sut
            check.start();
            check.stop();

            // assert
            expect(check.state).toBe(CHECK_STATES.STOPPED);
            expect(clearInterval).toHaveBeenCalledTimes(1);
            expect(clearInterval).toHaveBeenLastCalledWith(intervalID);
        });

        it('should not clearInterval when not running', () => {
            const check = new Check(mockConfig);

            // mock timers
            jest.useFakeTimers();
            setInterval.mockReturnValue(intervalID);

            // sut
            check.stop();

            // assert
            expect(clearInterval).toHaveBeenCalledTimes(0);
        });
    });

    /**
     * _tick()
     */
    describe('_tick()', () => {
        // mock check adapter
        let mockCheckResponse;
        let mockAdapter = {};

        beforeEach(() => {
            // reset mock between tests
            mockCheckResponse = {output: null, passed: true};
            mockAdapter.heartbeat = jest.fn(() => Promise.resolve(mockCheckResponse));
        });

        it('should call adapter::heartbeat()', () => {
            // constants
            const check = new Check(mockConfig, mockAdapter);

            // mock behavior
            mockAdapter.heartbeat.mockReturnValue(Promise.resolve(mockCheckResponse));

            // sut
            check._tick();

            // assert
            expect(mockAdapter.heartbeat).toHaveBeenCalledTimes(1);
        });

        it('check should be in passing state when adapter::heartbeat() passes', async () => {
            // constants
            const check = new Check(mockConfig, mockAdapter);

            // mock behavior
            mockCheckResponse.passed = true;

            // sut
            await check._tick();

            // assert
            expect(check.state).toBe(CHECK_STATES.PASSING);
        });

        it('check should be in failed state when adapter::heartbeat() does not pass', async () => {
            // constants
            const check = new Check(mockConfig, mockAdapter);

            // mock behavior
            mockCheckResponse.passed = false;

            // sut
            await check._tick();

            // assert
            expect(check.state).toBe(CHECK_STATES.FAILED);
        });

        it('check should be in failed state when adapter::heartbeat() throws error', async () => {
            // constants
            const check = new Check(mockConfig, mockAdapter);

            // mock behavior
            mockAdapter.heartbeat = () => {
                throw new Error;
            };

            // sut
            await check._tick();

            // assert
            expect(check.state).toBe(CHECK_STATES.FAILED);
        });

    });
});

