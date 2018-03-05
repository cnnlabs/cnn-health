const { CHECK_STATUS } = require('../src/common/constants');
const Health = require('../src/health');
const MockCheck = require('./mocks/check');
/**
 * Tests for Health class
 */
describe('Health', () => {
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
            const mockCheck = new MockCheck;

            // mock check start fn
            mockCheck.start = jest.fn();

            // create health
            const health = new Health([mockCheck]);

            // sut
            health.start();

            // assert
            expect(mockCheck.start).toHaveBeenCalledTimes(1);
        });

        it('should return if already running', () => {
            const mockCheck = new MockCheck;

            // mock check start fn
            mockCheck.start = jest.fn();

            // create health
            const health = new Health([mockCheck]);

            // sut
            health.start();
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
            const mockCheck = new MockCheck;

            // mock check stop fn
            mockCheck.stop = jest.fn();
            mockCheck.start = jest.fn();

            // create health, start check to change status
            const health = new Health([mockCheck]);
            health.start();

            // sut
            health.stop();

            // assert
            expect(mockCheck.stop).toHaveBeenCalledTimes(1);
        });

        it('should return if not running', () => {
            const mockCheck = new MockCheck;

            // mock check stop fn
            mockCheck.stop = jest.fn();
            mockCheck.start = jest.fn();

            // create health, start check to change status
            const health = new Health([mockCheck]);
            health.start();

            // sut
            health.stop();
            health.stop();

            // assert
            expect(mockCheck.stop).toHaveBeenCalledTimes(1);
        });
    });

    /**
     * _handleStatusChange()
     */
    describe('_handleStatusChange()', () => {

        it('should record state of given check object', () => {
            const expectedState = {passed: true, output: null};
            const checkName = 'test-check';
            const mockCheck = new MockCheck(checkName, expectedState);
            const health = new Health([mockCheck]);

            // sut
            health._handleStatusChange(mockCheck);

            // assert
            expect(health.currentState.checks[checkName]).toEqual(expectedState);
        });

        it('should notify listeners on state change', () => {
            const mockChangeListener = jest.fn();
            const mockCheck = new MockCheck('test-check', {passed: true, output: null});
            const health = new Health([mockCheck], mockChangeListener);

            // sut
            health._handleStatusChange(mockCheck);

            // assert
            expect(mockChangeListener).toHaveBeenCalledTimes(1);
            expect(mockChangeListener).toHaveBeenCalledWith(health._state);
        });

        it('should not be healthy when a check fails', () => {
            const mockCheck = new MockCheck('test-check', {passed: false, output: null});
            const health = new Health([]);

            // path to healthy state
            health._state.healthy = true;
            health._state.status = CHECK_STATUS.PASSING;

            // sut
            health._handleStatusChange(mockCheck);

            // assert
            expect(health.currentState.status).toBe(CHECK_STATUS.FAILED);
            expect(health.currentState.healthy).toBe(false);
        });

        it('should be healthy when all checks are passing', () => {
            const mockCheck = new MockCheck('test-check', {output: null, status: CHECK_STATUS.PASSING});
            const health = new Health([mockCheck]);

            // path to healthy state
            health._state.healthy = false;
            health._state.status = CHECK_STATUS.FAILED;

            // sut
            health._handleStatusChange(mockCheck);

            // assert
            expect(health.currentState.status).toBe(CHECK_STATUS.PASSING);
            expect(health.currentState.healthy).toBe(true);
        });

        it('should not be healthy after a single check passes while others are failing', () => {
            const passingCheck = new MockCheck('test-check-pass', {passed: true, output: null, status: CHECK_STATUS.PASSING});
            const failingCheck = new MockCheck('test-check-fail', {passed: false, output: null, status: CHECK_STATUS.FAILED});
            const health = new Health([passingCheck, failingCheck]);

            // path to healthy state
            health._state.healthy = false;
            health._state.status = CHECK_STATUS.FAILED;

            // sut
            health._handleStatusChange(passingCheck);

            // const isPas = Object.values(health._state.checks)
            //     .reduce((isPassing, check) => {
            //         console.log(check, 'ok');
            //         const isCheckPassing = check.currentState.status === CHECK_STATUS.PASSING;
            //         return isCheckPassing ? isPassing : false;
            //     }, true);

            // const a = Object.values(health._state.checks).reduce((isPassing, check) => check.currentState.status === CHECK_STATUS.PASSING ? isPassing : false, true);

            // assert
            expect(health.currentState.status).toBe(CHECK_STATUS.FAILED);
            expect(health.currentState.healthy).toBe(false);
        });
    });

    /**
     * _transition()
     */
    describe('_transition()', () => {

        it('should return if state has not changed', () => {
            const onStatusChange = jest.fn();
            const health = new Health([], onStatusChange);

            // patch to pending state
            health._state.status = CHECK_STATUS.PENDING;

            // sut
            health._transition(CHECK_STATUS.PENDING);

            // assert
            expect(onStatusChange).toHaveBeenCalledTimes(0);
        });

        it('should notify listeners on state change', () => {
            const onStatusChange = jest.fn();
            const health = new Health([], onStatusChange);

            // sut
            health._transition(CHECK_STATUS.PENDING);

            // assert
            expect(onStatusChange).toHaveBeenCalledTimes(1);
        });
    });
});

