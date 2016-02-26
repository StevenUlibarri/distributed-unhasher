'use strict';

let crypto = require('crypto');

class Hasher {

	constructor(algorithm) {
		this.algorithm = algorithm || 'sha256';
	}

	hashString(string) {
		let hash = crypto.createHash(this.algorithm);
		hash.update(string);
		return hash.digest('hex');
	}
}

module.exports = Hasher;