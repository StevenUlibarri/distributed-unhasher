'use strict';

let preprocess = (data) => {
	let fourTriples =  _processFours(data['fours']);
	let fivePairs =  _processFives(data['fives']);

	let chunkedTriples = chunkTriples(fourTriples);

	return {
		chunkedTriples: chunkedTriples,
		fivePairs: fivePairs
	};
};

let _processFives = (fives) => {
	let pairs = [];
	for(var i = 0; i < fives.length; i++) {
		for(var j = 0; j < fives.length; j++) {
			if(fives[i] != fives[j])
				pairs.push([fives[i], fives[j]]);
		}
	}
	return pairs;
};

let _processFours = (fours) => {
	let triples = [];
	for(var i = 0; i < fours.length; i++) {
		for(var j = 0; j < fours.length; j++) {
			for(var k = 0; k < fours.length; k++) {
				if(fours[i] != fours[j] && fours[i] != fours[k] && fours[j] != fours[k])
					triples.push([fours[i], fours[j], fours[k]]);
			}
		}
	}
	return triples;
};

let chunkTriples = (triples) => {
	let chunks = [];
	let chunk = [];
	for(let i = 0; i < triples.length; i ++) {
		if(i % 30 === 0) {
			chunk.push(triples[i]);
			chunks.push(chunk);
			chunk = [];
		}
		chunk.push(triples[i]);
	}
	if(chunk.length != 0)
		chunks.push(chunk);
	return chunks;
};

module.exports = preprocess;