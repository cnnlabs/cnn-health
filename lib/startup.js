'use strict';
const HealthChecks = require('./healthchecks'),
    fs = require('fs'),
    path = require('path'),
    checks = require('./plugins/checks');

function readConfigDir(configDir) {
    if (!fs.existsSync(configDir)) {
        throw new Error(`${configDir} does not exist`);
    }

    return fs.readdirSync(configDir);
}

function getConfigDir() {
    const cwd = process.cwd(),
        dirs = [
            path.resolve(cwd, 'healthchecks'),
            path.resolve(cwd, 'config')
        ];

    for (let dir of dirs) {
        if (fs.existsSync(dir)) {
            return dir;
        }
    }

    throw new Error(`Failed to find config directory checked ${dirs.join(' & ')}`);
}

function startup(configPath, additionalChecks) {
    if (arguments.length === 1 && typeof configPath !== 'string') {
        configPath = additionalChecks;
        additionalChecks = null;
    }

    Object.assign(checks, additionalChecks);

    const configDir = configPath || getConfigDir(),
        healthCheckMap = new Map();

    readConfigDir(configDir).forEach(function (configFile) {

        if (configFile.indexOf('.json') > -1) {
            return;
        }

        const name = configFile.replace('.js', ''),
            config = require(path.resolve(configDir, configFile)),
            healthchecks = new HealthChecks(config, checks);

        healthchecks.start();
        healthCheckMap.set(name, healthchecks);
    });

    return healthCheckMap;
}

module.exports = startup;
