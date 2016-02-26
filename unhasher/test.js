'use strict';

let rp = require('request-promise');

let url = 'http://arch:3000/';

let options = {
	method: 'POST',
	uri: url + 'work',
	body: {
		'needsPairs': false,
		'needsHash': true
	},
	json: true
};
rp(options)
	.then(res => {
		console.log(res);
	});

