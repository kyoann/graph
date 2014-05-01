var fs = require('fs');

// initialize dataIndex
// for each data file
// 	split data in words
// 	order the words list
//	for each unique word
//		update dataIndex
// serialize dataIndex
//



var splitRegExp = /\w+/g;

function splitData(data) {
	var words = data.match(splitRegExp);
	return words;
}

var dataPath = '../graphRepository/data/';
var dataIndexFile = '../graphRepository/dataIndex.json';
var dataIndex = {};
var dataFiles = fs.readdirSync(dataPath);
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
		if(!dataIndex[currentWord]) {
			dataIndex[currentWord] = [];
		}
		dataIndex[currentWord].push(dataFiles[i].substring(0,dataFiles[i].length - 4));
		previousWord = currentWord;
	}
}

console.log(JSON.stringify(dataIndex));
fs.writeFile(dataIndexFile,JSON.stringify(dataIndex),['utf8'],function(err) {
	if(err) {
		throw(err);
	}
	console.log("dataIndexing done");
});

var nodesPath = '../graphRepository/';
var labelsIndexFile = '../graphRepository/labelsIndex.json';
var labelsIndex = {};
var nodesFiles = fs.readdirSync(nodesPath);
var nodeFileRE = /\d+\.json/
for(var i = 0 ; i < nodesFiles.length ; i++) {
	if(!nodesFiles[i].match(nodeFileRE)) {
		console.log("no match:"+nodesFiles[i]);
		continue;
	}
	var data = fs.readFileSync(nodesPath + nodesFiles[i],['utf8']);
	console.log(nodesFiles[i] + ':' + data.toString());
	var node = JSON.parse(data.toString());
	console.log("file:"+nodesFiles[i]);
	console.log("label:"+node.label);
	var words = splitData(node.label);
	if(!words) {
		continue;
	}
	sortedWords = words.sort();
	var previousWord;
	var currentWord;
	for(var j = 0 ; j < sortedWords.length ; j++) {
		currentWord = sortedWords[j].toLowerCase();
		if(currentWord === previousWord) {
			continue;
		}	
		debugger;
		if(!labelsIndex[currentWord]) {
			labelsIndex[currentWord] = [];
		}
		labelsIndex[currentWord].push(nodesFiles[i].substring(0,nodesFiles[i].length - 5));
		previousWord = currentWord;
	}
}

console.log(JSON.stringify(labelsIndex));
fs.writeFile(labelsIndexFile,JSON.stringify(labelsIndex),['utf8'],function(err) {
	if(err) {
		throw(err);
	}
	console.log("labelsIndexing done");
});
