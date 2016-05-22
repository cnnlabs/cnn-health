'use strict';
require('isomorphic-fetch');
const health = require('../main'),
    path = require('path'),
    otherChecks = require('./lib/customcheck')


let healthchecks = health(path.resolve(__dirname,'./config')).asArray()

function test() {
    let checks = healthchecks.map((check) => {
        return check.getStatus();
    });

    console.log(checks);
}



setInterval(test, 2000);

