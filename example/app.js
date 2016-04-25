'use strict';
require('isomorphic-fetch');
var health = require('../main'),
    config = require('./config');

console.log(config);
let checks = health(config);
