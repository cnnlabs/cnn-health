const HealthCheckAdapter = require('../adapter');

/**
* Custom HealthCheck Adapter
*/
module.exports = class CustomCheckAdapter extends HealthCheckAdapter {
    
    constructor(options) {
        super(options);

        // options should include custom check fn
        if (!options || !options.heartbeat) {
            throw new Error('custom check adapter must define heartbeat() fn');
        }
    }

    async heartbeat() {
        try {
            // proxy to custom heartbeat fn() with hb factory as parameter
            const hb = await this.options.heartbeat(this.hb);

            // sanity check on return type
            if (!hb.hasOwnProperty('output') || !hb.hasOwnProperty('passed')) {
                throw new Error('custom check adapter must return hearbeat object');
            }

            // return heartbeat
            return hb;

        } catch (err) {
            // err: return failed heartbeat with error message
            return this.hb(false, String(err));
        }
    }
}