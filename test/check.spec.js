const { CHECK_STATUS, CHECK_DESCRIPTION_PROPERTIES } = require('../src/common/constants');
const Check = require('../src/check');

/**
 * Tests for Check class
 */
describe('Check', () => {
    // mock config
    const mockConfig = {
        type: 'custom',
        interval: 60000,
        description: CHECK_DESCRIPTION_PROPERTIES.reduce((map, prop) => {
            map[prop] = 'test';
            return map;
        }, {}),
        options: {
            heartbeat: () => {}
        }
    };

    /**
     * constructor
     */
    describe('constructor()', () => {
        const tests = {
            '1m': 60000,
            60: 60
        };

        Object.keys(tests).forEach(testValue => {
            it('should convert given check interval', () => {
                const opts = Object.assign({}, mockConfig, {interval: testValue});
                const check = new Check(opts);
                expect(check._interval).toBe(tests[testValue]);
            });
        });

        it('should be created in the STOPPED state', () => {
            const check = new Check(mockConfig);
            expect(check.currentState.status).toBe(CHECK_STATUS.STOPPED);
        });

        it('should have expected description', () => {
            const check = new Check(mockConfig);
            expect(check.desc).toBe(mockConfig.description);
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
            expect(check.currentState.status).toBe(CHECK_STATUS.PENDING);
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
            expect(check.currentState.status).toBe(CHECK_STATUS.STOPPED);
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

        beforeEach(() => {
            // reset mock between tests
            mockCheckResponse = {output: null, passed: true};
            mockConfig.options.heartbeat = jest.fn(() => Promise.resolve(mockCheckResponse));
        });

        it('should call adapter::heartbeat()', () => {
            // constants
            const check = new Check(mockConfig);

            // mock behavior
            mockConfig.options.heartbeat.mockReturnValue(Promise.resolve(mockCheckResponse));

            // sut
            check._tick();

            // assert
            expect(mockConfig.options.heartbeat).toHaveBeenCalledTimes(1);
        });

        it('check should be in passing state when adapter::heartbeat() passes', async () => {
            // constants
            const check = new Check(mockConfig);

            // mock behavior
            mockCheckResponse.passed = true;

            // sut
            await check._tick();

            // assert
            expect(check.currentState.status).toBe(CHECK_STATUS.PASSING);
        });

        it('check should be in failed state when adapter::heartbeat() does not pass', async () => {
            // constants
            const check = new Check(mockConfig);

            // mock behavior
            mockCheckResponse.passed = false;

            // sut
            await check._tick();

            // assert
            expect(check.currentState.status).toBe(CHECK_STATUS.FAILED);
        });

        it('check should be in failed state when adapter::heartbeat() throws error', async () => {
            // constants
            const check = new Check(mockConfig);
            const errMessage = 'test-error';

            // patch adapter to throw error
            check._adapter.heartbeat = () => {
                throw new Error(errMessage);
            };

            // sut
            await check._tick();

            // assert
            expect(check.currentState.status).toBe(CHECK_STATUS.FAILED);
            expect(check.currentState.output).toContain(errMessage);
        });
    });

    /**
     * _transition()
     */
    describe('_transition()', () => {

        it('should notify listener on status change', () => {
            // constants
            const reporter = jest.fn();
            const check = new Check(mockConfig, reporter);

            // sut
            check._transition(CHECK_STATUS.PASSING, 'test-output');

            // assert
            expect(reporter).toHaveBeenCalledTimes(1);
            expect(reporter).toHaveBeenCalledWith(check);
        });

        it('should not notify listeners when status and output are unchanged', () => {
            // constants
            const reporter = jest.fn();
            const check = new Check(mockConfig, reporter);
            const checkStatus = CHECK_STATUS.PASSING;
            const checkOutput = 'test-output';

            // initial state
            check._state = {status: checkStatus, output: checkOutput};

            // sut
            check._transition(checkStatus, checkOutput);

            // assert
            expect(reporter).toHaveBeenCalledTimes(0);
        });
    });
});

