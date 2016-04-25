'use strict';
require('isomorphic-fetch');
var health = require('../main'),
    config = require('./config');

let checks = health(config);

console.log(checks.asMap());
console.log(checks.asArray());
