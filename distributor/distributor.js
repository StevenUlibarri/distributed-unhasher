'use strict';

let Moment = require('moment');
let WordGetter = require('./word-getter');
let Preprocessor = require('./preprocessor');
let rp = require('request-promise');

let Peers= require('./config').peers;

let hash;
let pairs;
let work;
let startTime;

let Distributor = {

	init: function(targetHash) {
		hash = targetHash;
	},

	start: function(req, res) {
		pre()
		.then(() => {
			console.log('work generated');
			console.log('notifying peers');
			notify('ready');
		});
		res();
	},

	handleWorkRequest: function(req, res) {
		let resp = {};
		if(work.length === 0) {
			resp.done = true;
		}
		else {
			resp.work = work.pop();
			if(req.payload.needsPairs)
				resp.pairs = pairs;
			if(req.payload.needsHash)
				resp.target_hash = hash;
		}
		res(resp);
	},

	handleSuccess: function(req, res) {
		console.log('solution: ' + req.payload.solution);
		let endTime = Moment();
		console.log('work finished at: ' + endTime.format('h:mm:ss'));
		console.log('time elapsed: ' + startTime.diff(endTime).format('h:mm:ss'));
		notify('done');
		res();
	},

	status: function(req, res) {
		res({
			'work_remaining': work.length
		});
	}
};

let pre = function() {
	startTime = Moment();
	console.log('Work Started at ' + startTime.format('h:mm:ss a'));
	return WordGetter()
	.then(words => {
		let processed = Preprocessor(words);
		pairs = processed['fivePairs'];
		work = processed['chunkedTriples'];
	})
	.catch(() => console.log('intitialization failed'));
};

let notify = function(path) {
	Peers.forEach((peer) => {
		rp(peer + path)
		.then(() => {console.log('peer ' + peer + ' notified');})
		.catch(() => {console.log('peer' + peer + ' unavailable');});
	});
};

module.exports = Distributor;