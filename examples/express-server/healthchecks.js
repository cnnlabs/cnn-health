const Health = require('../../src/health');
const debug = require('debug');

// logging objects
const appHealthDebug = debug('checks:app-health');
const dynamicDebug = debug('checks:dynamic');
const alywaysPassingDebug = debug('checks:always-passing');
const jsonDebug = debug('checks:json');

// healthcheck configuration
const checks = [
    {
        type: 'custom',
        interval: 1000 * 10,
        description: {
            name: 'example-always-passing',
            severity: 'BAD',
            panicGuide: "Don't Panic",
            businessImpact: 'Who Knows',
            technicalSummary: '...'
        },
        options: {
            heartbeat: (hb) => {
                alywaysPassingDebug('🏥: is-healthy: true');  
                return hb(true, 'always passing')
            }
        }
    },
    {
        type: 'custom',
        interval: 5000,
        description: {
            name: 'dynamic-example',
            severity: 'BAD',
            panicGuide: "Don't Panic",
            businessImpact: 'Who Knows',
            technicalSummary: '...'
        },
        options: {
            heartbeat: (hb) => {
                const isHealthy = new Date().getTime() % 3 === 0 ? true : false;
                dynamicDebug(`🏥: is-healthy: ${isHealthy}`);
                return hb(isHealthy, 'dynamic custom check');
            }
        }
    },
    {
        type: 'json',
        interval: 1000 * 20,
        description: {
            name: 'json-example',
            severity: 'BAD',
            panicGuide: "Don't Panic",
            businessImpact: 'Who Knows',
            technicalSummary: '...'
        },
        options: {
            url: 'https://jsonplaceholder.typicode.com/posts/1',
            callback(data) {
                jsonDebug(data);
                return true;
            }
        }
    }
];

// debug changes to health
function onStatusChange(healthState) {
    appHealthDebug(`🏥: APP HEALTHY?: ${healthState.healthy}`);
}

// return instance of cnn-health
module.exports = new Health(checks, onStatusChange);