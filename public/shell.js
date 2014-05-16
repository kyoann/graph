var socket = io.connect('http://localhost:3000');
socket.on('connected',function(data) {
	//TODO
	document.querySelector("#connexionDivId").innerHTML='connected';
});
var $ = function(s) { return document.querySelector(s);}
function init() {
	addPrompt();
}
var shellDiv,promptSpan,inputSpan;
function addPrompt() {
	shellDiv = document.createElement('div');
	promptSpan = document.createElement('span');
	//var inputSpan = document.createElement('textarea');
	inputSpan = document.createElement('span');
	shellDiv.className = 'shell';
	promptSpan.className = 'shellPrompt';
	inputSpan.className = 'shellInput';
	$('#shellContainer').appendChild(shellDiv);	
	shellDiv.appendChild(promptSpan);
	shellDiv.appendChild(inputSpan);
	promptSpan.innerHTML = '>&nbsp;'
	inputSpan.contentEditable = true;
	inputSpan.addEventListener('keydown',processKeyboardEvent,true);
	inputSpan.addEventListener('keypressed',processKeyboardEvent,true);
	inputSpan.focus();
}
function processKeyboardEvent(e) {
	//console.log(e);
	if(e.keyIdentifier === "Enter" && e.shiftKey ) {
		console.log("execute");
		e.preventDefault();
		e.target.contentEditable = false;
		var cmd = e.target.textContent;
		shellParser.parse(cmd);
		addPrompt();
	}
}

function cmd_ls(label) {
	freezePrompt();	
	getNeighbours(getCurrentNodeId(),function(nodesModels) {
		pushUI('neighbours',nodesModels);
		addPrompt();
	});
}
function cmd_navigate() {
	navigator_append($('#shellContainer'),{label:"root",id:"0"});
}
function pushUI(UIname,nodesModels) {
//TODO
}

function getCurrentNodeId() {
	//TODO
	return 23;
}
function freezePrompt() {
	inputSpan.contentEditable = false;
}
