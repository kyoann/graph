function nodeCreator_append(container,uiId) {
	var nodeCreatorDiv = ui_createUI(uiId,'Creator');

	var contentDiv = ui_getContentDiv(nodeCreatorDiv);

	var textInput = document.createElement('input');
	var button = document.createElement('button');
	button.textContent = 'Create';
	var resultDiv = document.createElement('div');

	button.addEventListener('click',function(e) {
		var label = textInput.value;
		createNode(label,function(node) {
			node_addNode(resultDiv,node);
		});
	});
	
	nodeCreatorDiv.appendChild(textInput);
	nodeCreatorDiv.appendChild(button);
	nodeCreatorDiv.appendChild(resultDiv);
	container.appendChild(nodeCreatorDiv);
}