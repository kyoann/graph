var fs = require('fs');

var dataPath = '../graphRepository/data/';
var dataIndexFile = '../graphRepository/dataIndex.json';

// initialize index
// for each data file
// 	split data in words
// 	order the words list
//	for each unique word
//		update index
// serialize index
//

var index = {};

var dataFiles = fs.readdirSync(dataPath);

var splitRegExp = /\w+/g;

function splitData(data) {
	var words = data.match(splitRegExp);
	return words;
}
for(var i = 0 ; i < dataFiles.length ; i++) {
	var data = fs.readFileSync(dataPath + dataFiles[i]);
	var words = splitData(data.toString());
	sortedWords = words.sort();
	var previousWord;
	var currentWord;
	for(var j = 0 ; j < sortedWords.length ; j++) {
		currentWord = sortedWords[j].toLowerCase();
		if(currentWord === previousWord) {
			continue;
		}	
		debugger;
		if(!index[currentWord]) {
			index[currentWord] = [];
		}
		index[currentWord].push(dataFiles[i].substring(0,dataFiles[i].length - 4));
		previousWord = currentWord;
	}
}

console.log(JSON.stringify(index));
fs.writeFile(dataIndexFile,JSON.stringify(index),['utf8'],function(err) {
	if(err) {
		throw(err);
	}
	console.log("indexing done");
});
