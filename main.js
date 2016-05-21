'use strict';

const startup = require('./lib/startup'),
    Check = require('./lib/plugins/checks/check'),
    status = require('./lib/plugins/checks/status'),
    checks = require('./lib/plugins/checks'),
    util = require('util');

function categoryInCheckName(healthCheck, check) {
    check.name = util.format('%s: %s', healthCheck.name, check.name);
    return check;
}

module.exports = function (config, additionalChecks) {
    if (typeof config === 'undefined' || config === null) {
        throw new Error('healthcheck config is undefined');
    }

    let healthCheckMap = startup(config, additionalChecks);

    return {
        asMap: () => healthCheckMap,
        asArray: () => {
            let healthCheckArray = [];
            for (let healthCheck of healthCheckMap.values()) {
                let checks = healthCheck.checks.map(categoryInCheckName.bind(null, healthCheck));
                healthCheckArray = healthCheckArray.concat(checks);
            }

            return healthCheckArray;
        }
    };
};

module.exports.Check = Check;
module.exports.status = status;

module.exports.getCheck = (conf) => {
    return new checks[conf.type](conf);
};

module.exports.runCheck = (conf) => {
    const check = new checks[conf.type](conf);
    check.start();
    return check;
};
