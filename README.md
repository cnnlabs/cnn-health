# CNN Health

![node](https://img.shields.io/node/v/cnn-health.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/cnn-health.svg?style=flat-square)](https://www.npmjs.com/package/cnn-health)
[![npm-downloads](https://img.shields.io/npm/dm/cnn-health.svg?style=flat-square)](https://www.npmjs.com/package/cnn-health)
[![dependency-status](https://gemnasium.com/cnnlabs/cnn-health.svg)](https://gemnasium.com/cnnlabs/cnn-health)

## Requirements

[Node 8.0.0+](https://npmjs.org)


## Installation

```shell
$ npm install :repo_url
```

## Usage

- create config obj with checks you wish to run
- create health object from config
- start health checks
- inspect health status as needed
- and/or supply a callback for status change notifications

```javascript
const Health = require('cnn-health');

// healthchecks
const config = [
    {
        // type of adapter to use
        type: 'json',

        // description of this check
        description: {
            name: 'example-check',
            severity: 'BAD',
            panicGuide: "Don't Panic",
            businessImpact: 'Who Knows',
            technicalSummary: '...'
        },

        // options for adapter
        options: {
            url: 'http://localhost/example.json',
            callback(data) {
                return true;
            }
        }
    }
];

// status-change handler
function onStatusChange(nextState) {
    console.log(nextState.healthy);
    console.log(nextState.status);
    console.log(nextState.checks);
}

// create instance of cnn-health with config and optional callback
const health = new Health(config, onStatusChange);

// start health checks
health.start();

// retrieve current state of all checks
health.currentState;

// stop health checks
health.stop();

```


## Examples
View `examples` directory for more usage examples.




## Contributing

If you would like to contribute, just fork and submit a pull request.  Please
review the [contributing guidelines](./CONTRIBUTING.md)
first.
