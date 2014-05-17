function nodeEditor_append(container,uiId,nodeModel,isReadOnly) {
	var nodeEditorDiv = document.createElement('div');
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
		nodeEditorDiv.appendChild(saveButton);
	}
	//TODO
	//nodeEditorDiv.appendChild(ul);
	//nodeEditorDiv.appendChild(linkInput);
	//nodeEditorDiv.appendChild(addLinkButton);
	container.appendChild(nodeEditorDiv);
}
