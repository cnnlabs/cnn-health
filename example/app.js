'use strict';
require('isomorphic-fetch');
var health = require('../main'),
    config = require('./config');

let checks = health(config),
    array = checks.asArray() || [],
    idx = 0;

for (; idx < array.length; idx++) {
    health.runCheck(array[idx]);

    console.log(health.getCheck(array[idx]));
}
