const HealthCheckAdapter = require('../src/adapter');
/**
 * Tests for HealthCheckAdapter
 */
describe('HealthCheckAdapter', () => {
    const opts = {param: 'value'};

    it('should create adapter with provided options', () => {
        const adapter = new HealthCheckAdapter(opts);
        expect(adapter.options).toBe(opts);
    });

    it('heartbeat() should throw error when not implemented', async () => {
        const adapter = new HealthCheckAdapter(opts);
        let didThrowError = false;

        try {
            await adapter.heartbeat();
        } catch (e) {
            didThrowError = true;
        }

        expect(didThrowError).toBe(true);
    });

    it('hb() should return object with keys [passed, output]', () => {
        const adapter = new HealthCheckAdapter(opts);
        const tests = [
            { test: [true, null], expect: [true, null] },
            { test: [false, null], expect: [false, null] },
            { test: [true, 'test-output'], expect: [true, 'test-output'] },
            { test: [false, 'test-output'], expect: [false, 'test-output'] }
        ];

        tests.map(test => {
            const hb = adapter.hb(...test.test);
            expect(hb.passed).toBe(test.expect[0]);
            expect(hb.output).toBe(test.expect[1]);
        });
    });
});

