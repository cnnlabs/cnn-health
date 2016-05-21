'use strict';
require('isomorphic-fetch');
const health = require('../main'),
    path = require('path'),
    otherChecks = require('./lib/customcheck')


let checks = health(path.resolve(__dirname,'./config'),otherChecks)
