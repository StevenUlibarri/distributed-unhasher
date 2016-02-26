'use strict';

let rp = require('request-promise');

let requestWords = () => {
	let options = {
		json: true,
		uri: 'https://code.neumont.edu/words/words/index?start=0&end=600'
	};
	return rp(options);
};

let filter = (json) => {
	let obj = {
		'fives': [],
		'fours': []
	};

	json.forEach(function (item) {
		let word = item['word'];
		if(word.length === 5)
			obj['fives'].push(word.toLowerCase());
		else if(word.length === 4)
			obj['fours'].push(word.toLowerCase());
	});
	return obj;
};

let getWords = () => {
	return requestWords()
		.then(json => filter(json))
		.catch(() => console.log('api unavailable'));
};

module.exports = getWords;