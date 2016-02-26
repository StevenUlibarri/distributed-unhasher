'use strict';

let rp = require('request-promise');

let url = 'http://arch:3000/';
let Hasher = require('./hasher');
let hasher = new Hasher('sha256');

let hash;
let pairs;
let id;

console.log('worker initialized');

process.on('message', function(message) {
	if(message.cmd === 'ready')
		handleReady(message.id);
});

let handleReady = child_id => {
	id = child_id;
	console.log('worker' + id + 'starting');
	getWork();
};

let getWork = () => {
	console.log('worker ' + id + ' requesting work.');
	let options = {
		method: 'POST',
		uri: url + 'work',
		body: {
			'needsPairs': (pairs === undefined),
			'needsHash': (hash === undefined)
		},
		json: true
	};
	rp(options)
		.then(res => {
//            console.log(res.target_hash);
			if(res.target_hash)
				hash = res.target_hash;
			if(res.pairs)
				pairs = res.pairs;
			return res.work;
		})
		.then(work => {
			doWork(work);
		});
};

let doWork = triples => {

	let success = false;
	let successStr = '';
	triples.forEach(triple => {
		pairs.forEach(pair => {
			let str = triple[0] + ' ' + pair[0] + ' ' + triple[1] + ' ' + pair[1] + ' ' + triple[2];
			let hashed = hasher.hashString(str);
			if(hashed === hash) {
				success = true;
				successStr = str;
				return;
			}
		});
		if(success)
			return;
	});

	if(success){
		let options = {
			method: 'POST',
			uri: url + 'success',
			body: {
				'solution': successStr
			},
			json: true
		};
		rp(options);
	}
	else {
		getWork();
	}
};



