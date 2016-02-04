'use strict';
const startup = require('./lib/startup');
const Check = require('./lib/plugins/checks/check');
const status = require('./lib/plugins/checks/status');
const checks = require('./lib/plugins/checks')

function categoryInCheckName(healthCheck, check){
	check.name = healthCheck.name + ': ' + check.name;
	return check;
}

module.exports = function(config, additionalChecks){
	let healthCheckMap = startup(config, additionalChecks);
	return{
		asMap: () => healthCheckMap,
		asArray: () => {
			let healthCheckArray = [];
			for (let healthCheck of healthCheckMap.values()) {
				let checks = healthCheck.checks.map(categoryInCheckName.bind(null, healthCheck));
				healthCheckArray = healthCheckArray.concat(checks);
			}

			return healthCheckArray;
		}
	}
};

module.exports.Check = Check;
module.exports.status = status;

module.exports.getCheck = conf => {
	return new checks[conf.type](conf);
};

module.exports.runCheck = conf => {
	const check = new checks[conf.type](conf);
	check.start();
	return check;
};
