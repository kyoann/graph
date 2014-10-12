/*
var socket = io.connect('http://localhost:3000');

socket.on('connected',function(data) {
	//TODO
	document.querySelector("#connexionDivId").innerHTML='connected';
});

*/
var $ = function(s) { return document.querySelector(s);}
function init() {
	shellContainer = $('#shellContainer');
	addPrompt();
	document.body.addEventListener('click',function(event) {
		var activeShellInput = shell_getActiveShellInput();
		if(activeShellInput) {
			activeShellInput.focus();
			//shellDiv.focus();
		}
	});
}
var shellContainer;  
var shellDiv,promptSpan,inputSpan;
function addErrorMessage(s) {
	var errorMsgDiv = document.createElement('div');
	errorMsgDiv.textContent = s;
	shellDiv.appendChild(errorMsgDiv);
}
function showCloseButton() {
	var buttonElm = shellDiv.querySelector('.shellCloseButton');
	buttonElm.style.display = 'block';
}

function addPrompt() {
	shellDiv = document.createElement('div');
	promptSpan = document.createElement('span');
	//var inputSpan = document.createElement('textarea');
	inputSpan = document.createElement('span');
	shellDiv.className = 'shell';
	promptSpan.className = 'shellPrompt';
	inputSpan.className = 'shellInput';
	shellContainer.appendChild(shellDiv);

//
	var closeButton = document.createElement('button');
	closeButton.textContent = 'X';
	closeButton.className = 'shellCloseButton';
	closeButton.style.display = 'none';
	shellDiv.appendChild(closeButton);
//	
	shellDiv.appendChild(promptSpan);
	shellDiv.appendChild(inputSpan);
	promptSpan.innerHTML = '>&nbsp;'
	inputSpan.contentEditable = true;
	inputSpan.addEventListener('keydown',processKeyboardEvent,true);
//	inputSpan.addEventListener('keypressed',processKeyboardEvent,true);
	inputSpan.focus();

}
function processKeyboardEvent(e) {
//	for(var t in e) {
//		console.log(t+":"+e[t]);
//	}
//		console.log(e.keyCode);
//		console.log(e.shiftKey);
	if( (e.keyIdentifier === "Enter" && !e.shiftKey) || (e.keyCode === 13 && !e.shiftKey) ) {
		
		e.preventDefault();
		freezePrompt();	
		var cmd = e.target.textContent;
		try {
			showCloseButton();
			shellParser.parse(cmd);
		}
		catch(e) {
			addErrorMessage(e.toString());
			showCloseButton();
			addPrompt();
		}
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
	getNode(0,function(rootNode) {
		navigator_append(shellContainer,getNextUIId(),rootNode);
		addPrompt();
	});
}
function cmd_create(label) {
	createNode(label,[],function(createdNode) {
		event_nodeCreated(createdNode);
		nodesList_append(shellContainer,getNextUIId(),[createdNode]);
		addPrompt();
	});
}
//TODO
var numberRe = /^\d+$/;
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
	else {
		getNodeUsingLabel(label,function(nodes) {
			if(nodes.length ==1) {
				var node = nodes[0];
				getNodeData(node.id,function(data){
					node.data = data;
					nodeEditor_append(shellContainer,getNextUIId(),node,isReadOnly);	
					addPrompt();
				});
			}
			else{
				//TODO
				addPrompt();
			}
		});

	}
}
function cmd_link(label1,label2) {
	getNode(label1, function(node1) {
		getNode(label2,function(node2) {
			linkNodes(node1.id,node2.id,function(aNode1) {
				event_nodeLinked(aNode1);
				linkNodes(node2.id,node1.id,function(aNode2) {
					event_nodeLinked(aNode2);
					addPrompt();
				});
			});
		});
	});
}
function cmd_unlink(label1,label2) {
	getNode(label1, function(node1) {
		getNode(label2,function(node2) {
			unlinkNodes(node1.id,node2.id,function(aNode1) {
				event_nodeUnlinked(aNode1);
				unlinkNodes(node2.id,node1.id,function(aNode2) {
					event_nodeUnlinked(aNode2);
					addPrompt();
				});
			});
		});
	});
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
