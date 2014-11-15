function editor_append(container,uiId,isReadOnly) {
	var nodeEditorDiv = document.createElement('div');
	nodeEditorDiv.style.display = 'none';
	nodeEditorDiv.addEventListener('click',function(event) {
		event.stopPropagation();
	});
	nodeEditorDiv.id = uiId;
	var labelInput = document.createElement('div');
	labelInput.className = 'nodeEditorLabel';
	var br1 = document.createElement('br');
//	var dataInput = document.createElement('div');
	var dataInput = document.createElement('textarea');
	dataInput.className = 'nodeEditorData';
	var br2 = document.createElement('br');
	var ul = document.createElement('ul');
	var linkInput = document.createElement('input');
	var addLinkButton = document.createElement('button'); 
	addLinkButton.textContent = "Add link";


	//
	nodeEditorDiv.appendChild(labelInput);
	nodeEditorDiv.appendChild(br1);
	nodeEditorDiv.appendChild(dataInput);
	nodeEditorDiv.appendChild(br2);
	
	var state = {id:"",label:"",data:""};
	var saveCB = function() {
		var nodeInNodeEditorLabel0 = state.label;
			if(state.label != labelInput.textContent) {
				saveNodeLabel(state.id,labelInput.textContent,function(node) {
					event_nodeLabelModified(node);
				});
			}
			if(state.data != dataInput.value) {
				saveNodeData(state.id,dataInput.value,function(node) { 
					event_nodeDataModified(node);
				});
			}
	}

	var makeEditorModifiable = function() {
		labelInput.contentEditable = 'true';
//		dataInput.contentEditable = 'true';
//		labelInput.readOnly = false;
		dataInput.readOnly = false;
		var saveButton = document.createElement('button'); 
		saveButton.textContent = "Save";
		saveButton.addEventListener('click',function(event) {
			saveCB();
		});
		nodeEditorDiv.appendChild(saveButton);



		labelInput.addEventListener('keydown',function(e) {
			if( (e.keyIdentifier === "S" && e.ctrlKey) || (e.keyCode === 83 && e.ctrlKey) ) {
				e.preventDefault();
				saveCB();
			}	
		});
		dataInput.addEventListener('keydown',function(e) {
			if( (e.keyIdentifier === "S" && e.ctrlKey) || (e.keyCode === 83 && e.ctrlKey) ) {
				e.preventDefault();
				saveCB();
			}	
		});
	}
	if(isReadOnly) {
		dataInput.readOnly = true;
		//TODO
		dataInput.addEventListener('dblclick',function(e) {
			console.log("dblclick");
			makeEditorModifiable();
		});
	} else {
		makeEditorModifiable();
	}
	//TODO
	//nodeEditorDiv.appendChild(ul);
	//nodeEditorDiv.appendChild(linkInput);
	//nodeEditorDiv.appendChild(addLinkButton);
	container.appendChild(nodeEditorDiv);

	event_addModelEventListener('nodeLabelModified',editor_createNodeLabelModifiedCB(nodeEditorDiv));
	event_addModelEventListener('nodeDataModified',editor_createNodeDataModifiedCB(nodeEditorDiv));
	
	var editFunction = function(nodeId) {
		getNode(nodeId, function(node) {
			nodeEditorDiv.style.display = 'inline';
			state.id = node.id;
			state.label = node.label;
			state.data = node.data;	

			nodeEditorDiv.dataset.nodeId = node.id;

			labelInput.textContent = node.label;
			if(node.data) {
				dataInput.value = node.data;
			} else {
				dataInput.value = "";
			}
//fit textarea to size
			if(node.data) {
	//	var nLines = node.data.split('\n').length;
				var nLines = 0;
				var i = 0;
				nLines = 1;
				while((i = node.data.indexOf('\n',i)) >= 0) {
					nLines++;
					;	
					i++;
				}
				dataInput.rows = nLines;
			}
		});
	};
	return editFunction;
}



function editor_createNodeLabelModifiedCB(nodeEditorDiv) {
	return function(modifiedNode) {
		if(nodeEditorDiv.dataset.nodeId != modifiedNode.id) {
			return;
		}
		var labelInput = nodeEditorDiv.querySelector('.nodeEditorLabel');
		labelInput.textContent = modifiedNode.label;
		state.label = modifiedNode.label;
	}
}
function editor_createNodeDataModifiedCB(nodeEditorDiv) {
	return function(modifiedNode) {
		if(nodeEditorDiv.dataset.nodeId != modifiedNode.id) {
			return;
		}
		var dataInput = nodeEditorDiv.querySelector('.nodeEditorData');
		dataInput.value = modifiedNode.data;
		state.data = modifiedNode.data;	
	}
}
