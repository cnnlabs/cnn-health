const Check = require('../src/check');
/**
 * Tests for Check class
 */
describe('Check', () => {
    const mockConfig = { interval: 60000 };


    /**
     * constructor
     */
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
});

