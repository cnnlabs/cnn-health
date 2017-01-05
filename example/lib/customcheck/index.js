const timedCheck = require('./timedchecks');
const customCheck = require('./custom.check');
const returnArray =[];

returnArray.push(timedCheck);
returnArray.push(customCheck);


module.exports = returnArray;

