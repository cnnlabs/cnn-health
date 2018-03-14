const JSONAdapter = require('../../src/adapters/json');
/**
 * Tests for JSON health-check adapter
 */
describe('JSONCheckAdapter', () => {
    const opts = {
        url: 'http://localhost'
    };
    
    beforeEach(() => {
        // reset mock fn before each test
        opts.callback = jest.fn();
    });

    describe('constructor()', () => {
        it('should create adapter with provided options', () => {
            const adapter = new JSONAdapter(opts);
            expect(adapter.options).toBe(opts);
        });

        it('should throw error when url is not provided', () => {
            const create = () => new JSONAdapter();
            expect(create).toThrow();
        });

        it('should throw error when callback is not provided', () => {
            const create = () => new JSONAdapter({ url: 'http://localhost' });
            expect(create).toThrow();
        });
    });

    describe('hearbeat()', () => {
        fetch = jest.fn();

        it('should fail when callback returns false', async () => {
            const expectedData = {test: 'test-value'};
            const adapter = new JSONAdapter(opts);

            // mock return         
            fetch.mockReturnValue({
                ok: true,
                json: () => expectedData
            });

            // sut
            const hearbeat = await adapter.heartbeat();

            // assert
            expect(opts.callback).toHaveBeenCalledTimes(1);
            expect(opts.callback).toHaveBeenCalledWith(expectedData);
            expect(hearbeat.passed).toBe(false);
        });

        it('should pass when callback returns true', async () => {
            const expectedData = {test: 'test-value'};
            const adapter = new JSONAdapter(opts);

            // mock callback return
            opts.callback = jest.fn();
            opts.callback.mockReturnValue(true);

            // mock return         
            fetch.mockReturnValue({
                ok: true,
                json: () => expectedData
            });

            // sut
            const heartbeat = await adapter.heartbeat();

            // assert
            expect(opts.callback).toHaveBeenCalledTimes(1);
            expect(opts.callback).toHaveBeenCalledWith(expectedData);
            expect(heartbeat.passed).toBe(true);
        });

        it('should fail when callback throws error', async () => {
            const expectedData = {test: 'test-value'};
            const expectedError = 'test-error';
            const adapter = new JSONAdapter(opts);

            // mock callback return
            opts.callback = () => {
                throw new Error(expectedError);
            }

            // mock return         
            fetch.mockReturnValue({
                ok: true,
                json: () => expectedData
            });

            // sut
            const heartbeat = await adapter.heartbeat();

            // assert
            expect(heartbeat.passed).toBe(false);
            expect(heartbeat.output).toContain(expectedError);
        });
    });
});
