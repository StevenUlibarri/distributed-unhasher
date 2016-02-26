'use strict';

let Hapi = require('hapi');

let server = new Hapi.Server();
server.connection({ port: 3001 });

let Manager = require('./manager');

Manager.init();

server.route({
	method: 'GET',
	path: '/ready',
	handler: Manager.handleReady
});

server.route({
	method: 'GET',
	path: '/done',
	handler: Manager.handleDone
});


server.start(function () {
	console.log('Server running at:', server.info.uri);
});