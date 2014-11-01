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
		console.log("body clicked");
		var activeShellInput = shell_getActiveShellInput();
		if(activeShellInput) {
			activeShellInput.focus();
			//shellDiv.focus();
		}
	});

	document.body.addEventListener('drop',function(event) {
		event.preventDefault();
	}, false);
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
	var lShellDiv = document.createElement('div');
	shellDiv = lShellDiv;
	promptSpan = document.createElement('span');
//	promptSpan = document.createElement('div');
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

	closeButton.addEventListener('click',function(event) {
		shellContainer.removeChild(lShellDiv);
	});
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
//		try {
			showCloseButton();
			shellParser.parse(cmd);
//		}
/*		catch(e) {
			addErrorMessage(e.toString());
			showCloseButton();
			addPrompt();
		}
*/
	}
}

function cmd_ls(label) {
	getNeighbours(getCurrentNodeId(),function(nodesModels) {
		pushUI('neighbours',nodesModels);
		addPrompt();
	});
}
function cmd_navigate(label) {
	getNode(0,function(rootNode) {
		var div = document.createElement('div');
		shellDiv.appendChild(div);
		navigator_append(div,getNextUIId(),[rootNode]);
		addPrompt();
	});
}
function cmd_create(label) {
	createNode(label,function(createdNode) {
		event_nodeCreated(createdNode);
		nodesList_append(shellContainer,getNextUIId(),[createdNode]);
		addPrompt();
	});
}
//TODO
var numberRe = /^\d+$/;
function cmd_edit(label,isReadOnly) {
		var div = document.createElement('div');
		shellDiv.appendChild(div);

	if(numberRe.test(label)) {
		getNode(label,function(node) {
			getNodeData(node.id,function(data){
				node.data = data;
				nodeEditor_append(div,getNextUIId(),node,isReadOnly);	
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
					nodeEditor_append(div,getNextUIId(),node,isReadOnly);	
					addPrompt();
				});
			}
			else{
				var createDblClickCB = function(nodeDiv) {
					return function() {
getNode(nodeDiv.dataset.nodeid,function(node) {
		getNodeData(node.id,function(data){
			node.data = data;
			nodeEditor_append(div,getNextUIId(),node,true);	
		});
	});
	
					}
				};
				navigator_append(div,getNextUIId(),nodes,createDblClickCB);
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
function cmd_search(label) {
	search(label,function(nodes) {
		var div = document.createElement('div');
		shellDiv.appendChild(div);
		nodesList_append(div,getNextUIId(),nodes);
		addPrompt();
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

function cmd_exportState() {
		var div = document.createElement('div');
		shellDiv.appendChild(div);
		lsGetState(function(state) {
			div.textContent = state;
			addPrompt();
		});
}

function cmd_importState() {
		var div = document.createElement('div');
		div.addEventListener('click',function(e) {
			e.stopPropagation();
		});
		shellDiv.appendChild(div);
		var textInput = document.createElement('input');
		textInput.type = 'text';	
		var textInputValidateButton = document.createElement('button');
		textInputValidateButton.textContent = 'Import';
		textInputValidateButton.addEventListener('click',function(event) {
			lsSetState(textInput.textContent, function() {
				div.removeChild(textInput);
				div.removeChild(textInputValidateButton);
				div.textContent = 'done';
			});
		});
		div.appendChild(textInput);		
		div.appendChild(textInputValidateButton);
		addPrompt();		
}