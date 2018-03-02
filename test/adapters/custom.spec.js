const CustomAdapter = require('../../src/adapters/custom');
/**
 * Tests for Custom health-check adapter
 */
describe('CustomCheckAdapter', () => {
    const opts = {};
    
    beforeEach(() => {
        // reset mock fn before each test
        opts.heartbeat = jest.fn();
    });

    describe('constructor()', () => {
        it('should create adapter with provided options', () => {
            const adapter = new CustomAdapter(opts);
            expect(adapter.options).toBe(opts);
        });

        it('should throw error when custom hearbeat is not provided', () => {
            const create = () => new CustomAdapter();
            expect(create).toThrow();
        });
    });

    describe('hearbeat()', () => {
        it('should call custom heartbeat fn', async () => {
            const adapter = new CustomAdapter(opts);
            await adapter.heartbeat();

            expect(opts.heartbeat).toHaveBeenCalledTimes(1);
        });

        it('should call custom heartbeat fn', async () => {
            const adapter = new CustomAdapter(opts);
            await adapter.heartbeat();

            expect(opts.heartbeat).toHaveBeenCalledTimes(1);
        });

        // heartbeat failures
        const tests = [
            () => false,
            () => ({}),
            () => ({output: ''})
        ]

        tests.forEach(async fn => {
            it('should return failed heartbeat when custom check does not return a heartbeat object', async () => {
                const adapter = new CustomAdapter({heartbeat: fn});
                const hb = await adapter.heartbeat();
                expect(hb.passed).toBe(false);
                expect(hb.output).not.toBeNull();
            });
        });

        it('should return heartbeat object from custom check fn', async () => {
            const heartbeatObj = {passed: true, output: 'test-output'};
            const options = { heartbeat: () => Promise.resolve(heartbeatObj) };
            const adapter = new CustomAdapter(options);

            const hb = await adapter.heartbeat();

            expect(hb).toBe(heartbeatObj);
        });
    });
});
