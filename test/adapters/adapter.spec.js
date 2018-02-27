const HealthCheckAdapter = require('../../src/adapters/adapter');
/**
 * Tests for HealthCheckAdapter
 */
describe('HealthCheckAdapter', () => {
    const opts = {param: 'value'};

    it('should create adapter with provided options', () => {
        const adapter = new HealthCheckAdapter(opts);
        expect(adapter.options).toBe(opts);
    });

    it('runCheck() should throw error when not overridden', () => {
        const adapter = new HealthCheckAdapter(opts);
        expect(adapter.runCheck).toThrow();
    })
});

