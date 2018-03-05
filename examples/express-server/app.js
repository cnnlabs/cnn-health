const express = require('express');
const app = express();
const healthchecks = require('./healthchecks');

// start healthchecks
healthchecks.start();

// healthcheck route
app.get('/hc', (req, res) => {
    const health = healthchecks.currentState;

    // compute status from health status
    const statusCode = health.healthy ? 200 : 500;
    
    // return health state
    return res.status(statusCode).send(health);
    
});

app.listen(3000, () => console.log('Example running on port 3000!'));