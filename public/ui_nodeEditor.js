function nodeEditor_append(container,uiId,nodeModel,isReadOnly) {
	var nodeEditorDiv = document.createElement('div');
	nodeEditorDiv.addEventListener('click',function(event) {
		console.log("node editor div:clicked");
		event.stopPropagation();
	});
	nodeEditorDiv.id = uiId;
	var labelInput = document.createElement('div');
	labelInput.className = 'nodeEditorLabel';
	var br1 = document.createElement('br');
	var dataInput = document.createElement('div');
	dataInput.className = 'nodeEditorData';
	var br2 = document.createElement('br');
	var ul = document.createElement('ul');
	var linkInput = document.createElement('input');
	var addLinkButton = document.createElement('button'); 
	addLinkButton.textContent = "Add link";

	labelInput.textContent = nodeModel.label;
	dataInput.textContent = nodeModel.data;


	nodeEditorDiv.appendChild(labelInput);
	nodeEditorDiv.appendChild(br1);
	nodeEditorDiv.appendChild(dataInput);
	nodeEditorDiv.appendChild(br2);
	if(!isReadOnly) {
		labelInput.contentEditable = 'true';
		dataInput.contentEditable = 'true';
		var saveButton = document.createElement('button'); 
		saveButton.textContent = "Save";
		saveButton.addEventListener('click',function(event) {
			var nodeInNodeEditorLabel0 = nodeModel.label;
			var nodeInNodeEditorData0 = nodeModel.data;
			var nodeInNodeEditorLabel1 = labelInput.textContent;
			var nodeInNodeEditorData1 = dataInput.textContent;
			if(nodeInNodeEditorLabel0 != nodeInNodeEditorLabel1) {
				saveNodeLabel(nodeModel.id,nodeInNodeEditorLabel1,function(node) {
					//TODO
					console.log('save label')
					//nodeModel.label = nodeInNodeEditorLabel1;
					event_nodeLabelModified(node);
				});
			}
			if(nodeInNodeEditorData0 != nodeInNodeEditorData1) {
				saveNodeData(nodeModel.id,nodeInNodeEditorData1,function(node) { 
					//TODO
					console.log('save data')
					nodeModel.data = nodeInNodeEditorData1;
					event_nodeDataModified(node);
				});
			}
		});
		nodeEditorDiv.appendChild(saveButton);
	}
	//TODO
	//nodeEditorDiv.appendChild(ul);
	//nodeEditorDiv.appendChild(linkInput);
	//nodeEditorDiv.appendChild(addLinkButton);
	container.appendChild(nodeEditorDiv);

	event_addModelEventListener('nodeLabelModified',nodeEditor_createNodeLabelModifiedCB(nodeEditorDiv));
	event_addModelEventListener('nodeDataModified',nodeEditor_createNodeDataModifiedCB(nodeEditorDiv));
}

function nodeEditor_createNodeLabelModifiedCB(nodeEditorDiv) {
	return function(modifiedNode) {
		var labelInput = nodeEditorDiv.querySelector('.nodeEditorLabel');
		labelInput.textContent = modifiedNode.label;
	}
}
function nodeEditor_createNodeDataModifiedCB(nodeEditorDiv) {
	return function(modifiedNode) {
		var dataInput = nodeEditorDiv.querySelector('.nodeEditorData');
		dataInput.textContent = modifiedNode.data;
	}
}
