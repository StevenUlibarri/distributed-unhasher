'use strict';

let Hapi = require('hapi');

let server = new Hapi.Server();
server.connection({ port: 3000 });

let targetHash = 'FAB5B1537807FF40FE49B17DBB476136AC06BBA884C0706926563A10F43B80AE'.toLowerCase();

let Distributor = require('./distributor');

Distributor.init(targetHash);

server.route({
	method: 'GET',
	path: '/start',
	handler: Distributor.start
});

server.route({
	method: 'GET',
	path: '/status',
	handler: Distributor.status
});

server.route({
	method: 'POST',
	path: '/work',
	handler: Distributor.handleWorkRequest
});

server.route({
	method: 'POST',
	path: '/success',
	handler: Distributor.handleSuccess
});

server.start(function () {
	console.log('Server running at:', server.info.uri);
});


