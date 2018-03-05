const HealthCheckAdapter = require('../adapter');
require('isomorphic-fetch');

/**
* JSON HealthCheck Adapter
*/
module.exports = class CustomCheckAdapter extends HealthCheckAdapter {
    
    constructor(options) {
        super(options);

        // options should include url and callback fn
        if (!options || !options.url || !options.callback) {
            throw new Error("json check adapter must define 'url' option");
        }
    }

    async heartbeat() {
        try {
            // make request to given url
            const response = await fetch(this.options.url);
            const isResponseOK = response.ok;
            const passing = isResponseOK && this.options.callback(await response.json());

            return passing ? this.hb(true, null) : this.hb(false, 'json-check callback failed the response');

        } catch (err) {
            // err: return failed heartbeat with error message
            return this.hb(false, String(err));
        }
    }
}