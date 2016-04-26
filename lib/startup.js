'use strict';
const HealthChecks = require('./healthchecks'),
    checks = require('./plugins/checks');

/**
 * Sets up the healthcheck mechanism
 * @param {object} config
 * @return {object} healthcheck mapping
 */
function startup(config) {
    const healthCheckMap = new Map(),
        healthchecks = new HealthChecks(config, checks);

    healthCheckMap.set('healthchecks', healthchecks);

    return healthCheckMap;
}

module.exports = startup;
