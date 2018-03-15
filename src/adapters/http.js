const HealthCheckAdapter = require('../adapter');
require('isomorphic-fetch');

/**
* HTTP HealthCheck Adapter
*/
module.exports = class HTTPCheckAdapter extends HealthCheckAdapter {

    constructor(options) {
        super(options);

        // options should include url
        if (!options || !options.url) {
            throw new Error("http check adapter must define 'url'");
        }
    }

    async heartbeat() {
        try {
            // make request to given url
            const res = await fetch(this.options.url);
            const data = await res.text();

            // fail:  throw error if response is not
            if (!res.ok) {
                throw new Error(`Non 2xx response: ${res.status} - ${res.statusText}`);
            }

            // fail: run callback if given with response text
            if (this.options.callback && !this.options.callback(data)) {
                throw new Error('Callback rejected response');
            }

            // passed: return true
            return this.hb(true, null);

        } catch (err) {
            // err: return failed heartbeat with error message
            return this.hb(false, String(err));
        }
    }
}