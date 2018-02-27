const HealthCheckAdapter = require('../../src/adapters/adapter');
/**
 * Tests for HealthCheckAdapter
 */
describe('HealthCheckAdapter', () => {
    const opts = {param: 'value'};

    /**
     * constructor
     */
    it('should create adapter with provided options', () => {
        const adapter = new HealthCheckAdapter(opts);
        expect(adapter.options).toBe(opts);
    });
});

