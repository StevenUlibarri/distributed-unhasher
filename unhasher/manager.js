'use strict';

let os = require('os');
let cp = require('child_process');

let workers = [];

let Manager = {

	init: function() {
		let cpus = os.cpus().length;
		for(var i = 0; i < cpus; i++) {
			let worker = cp.fork('./worker.js');
			workers.push(worker);
			worker.on('message', handleMessage);
		}
	},

	handleReady: function(req, res) {
		workers.forEach((worker, index) => {
			worker.send({
				id: index,
				cmd: 'ready'
			});
		});
		res();
	},

	handleDone: function(req, res) {
		workers.forEach((worker, index) => {
			worker.disconnect();
			workers.splice(index,1);
		});
		res();
	}
};

let handleMessage = message => {

};



module.exports = Manager;