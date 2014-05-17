var socket = io.connect('http://localhost:3000');
socket.on('connected',function(data) {
	//TODO
	document.querySelector("#connexionDivId").innerHTML='connected';
});
var $ = function(s) { return document.querySelector(s);}
function init() {
	shellContainer = $('#shellContainer');
	addPrompt();
	document.body.addEventListener('click',function(event) {
		var activeShellInput = shell_getActiveShellInput();
		if(activeShellInput) {
			//activeShellInput.focus();
			shellDiv.focus();
		}
	});
}
var shellContainer;  
var shellDiv,promptSpan,inputSpan;
function addPrompt() {
	shellDiv = document.createElement('div');
	promptSpan = document.createElement('span');
	//var inputSpan = document.createElement('textarea');
	inputSpan = document.createElement('span');
	shellDiv.className = 'shell';
	promptSpan.className = 'shellPrompt';
	inputSpan.className = 'shellInput';
	shellContainer.appendChild(shellDiv);	
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
	if(e.keyIdentifier === "Enter" && !e.shiftKey ) {
		e.preventDefault();
		freezePrompt();	
		var cmd = e.target.textContent;
		shellParser.parse(cmd);
	}
}

function cmd_ls(label) {
	getNeighbours(getCurrentNodeId(),function(nodesModels) {
		pushUI('neighbours',nodesModels);
		addPrompt();
	});
}
var uiIndex = 0;
function getNextUIId() {
	return "ui"+uiIndex++;
}
function cmd_navigate() {
	navigator_append(shellContainer,getNextUIId(),{label:"root",id:"0"});
	addPrompt();
}
function cmd_create(label) {
	createNode(label,[],function(createdNode) {
		event_nodeCreated(createdNode);
		nodesList_append(shellContainer,getNextUIId(),[createdNode]);
		addPrompt();
	});
}
//TODO
var numberRe = /\d+/;
function cmd_edit(label,isReadOnly) {
	if(numberRe.test(label)) {
		getNode(label,function(node) {
			getNodeData(node.id,function(data){
				node.data = data;
				nodeEditor_append(shellContainer,getNextUIId(),node,isReadOnly);	
				addPrompt();
			});
		});
	}
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
function shell_getActiveShellInput() {
	//	return document.querySelector('.shellInput[contenteditable]');
	return inputSpan;
}
