function nodesList_append(container,nodesListId,nodes) {
	var nodesListDiv = ui_createUI(nodesListId,'');
	container.appendChild(nodesListDiv);
	var contentDiv = ui_getContentDiv(nodesListDiv);
	node_addNodes(contentDiv,nodes,nodesListId);
}