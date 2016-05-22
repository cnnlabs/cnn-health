const debug = require('debug')('cnn-health:example:config:index');
module.exports = {
    name: 'json check fixture',
    description: 'json check fixture description',
    checks: [
        {
            type: 'json',
            name: 'CNN Homepage',
            url: 'http://www.cnn.com/_healthcheck',
            severity: 2,
            businessImpact: 'Its a HUGE deal',
            technicalSummary: 'god knows',
            panicGuide: 'Don\'t Panic',
            checkResult: {
                PASSED: 'Text if check passed',
                FAILED: 'Text is check failed',
                PENDING: 'This check has not yet run'
            },
            interval: '10s',
            callback: function (json) {
                debug(json.version)
                return json.version;
            }
        },
        // {
        //     type: 'mongo',
        //     name: 'database',
        //     collection: 'users',
        //     severity: 2,
        //     businessImpact: 'Its a HUGE deal',
        //     technicalSummary: 'god knows',
        //     panicGuide: 'Don\'t Panic',
        //     checkResult: {
        //         PASSED: 'Text if check passed',
        //         FAILED: 'Text is check failed',
        //         PENDING: 'This check has not yet run'
        //     },
        //     interval: '10s'
        // }
    ]
}
