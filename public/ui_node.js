function node_addNodes(container, nodesModels,uiId) {
	var nodesViews = [];
	for(var i = 0, length = nodesModels.length ; i < length ; i++) {
		nodesViews.push(node_addNode(container, nodesModels[i],uiId));
	}
	return nodesViews;
}
function node_addNode(container, node, uiId) {
	var nodeDiv = document.createElement("div");
	nodeDiv.className = 'node';
	nodeDiv.id = container.id + 'Node' + node.id;
	nodeDiv.dataset.containerid = container.id;
	nodeDiv.dataset.uiId = uiId;
	nodeDiv.dataset.nodeid = node.id;
	nodeDiv.draggable = true;
	nodeDiv.addEventListener('dragstart',function(event) {node_drag(event);},false);
	nodeDiv.addEventListener('dragover',function(event) {ev.preventDefault();},false);
	nodeDiv.addEventListener('drop',function(event) {node_dropOnNode(event);},false);
	nodeDiv.textContent = node.label;

	var outerNodeDiv = document.createElement("div");
	outerNodeDiv.className = 'nodeWrapper';
	outerNodeDiv.appendChild(nodeDiv);
	container.appendChild(outerNodeDiv);
	return nodeDiv;
}
function node_drag(ev) {
	ev.dataTransfer.setData("Text",ev.target.id);
}
function node_dropOnNode(ev) {
	var draggedNodeViewId = ev.dataTransfer.getData('Text');
	var draggedNodeView = document.querySelector('#'+draggedNodeViewId);
	var draggedNodeId = draggedNodeView.dataset.nodeid;
	var droppedOnNode = ev.target;
	if(draggedNodeId === droppedOnNode.dataset.nodeid) {
		return false;
	}
	linkNodes(droppedOnNode.dataset.nodeid,draggedNodeId, function(updatedNode) {
		event_nodeLinked(updatedNode);	
	});
	linkNodes(draggedNodeId,droppedOnNode.dataset.nodeid, function(updatedNode) {
		event_nodeLinked(updatedNode);	
	});
	ev.stopPropagation();
}
function node_highLightNodeDiv(nodeDiv) {
	var containerView = document.querySelector('#' + nodeDiv.dataset.containerid);
	var currentNodeDiv = containerView.firstChild;
	while(currentNodeDiv) {
		var realNodeDiv = currentNodeDiv.firstChild;
		if(realNodeDiv == nodeDiv) {
			realNodeDiv.className = 'selectedNode';
		}
		else {
			if(realNodeDiv && realNodeDiv.constructor.name == 'HTMLDivElement') {
				realNodeDiv.className = 'node';
			}
		}
		currentNodeDiv = currentNodeDiv.nextSibling;
	}
}
function node_getSelectedNodeView(container) {
	var selectedNodeView = container.querySelector('.selectedNode');
	return selectedNodeView;
}
function node_getNodeView(container,nodeId) {
	var currentNodeView = container.firstChild;
	while(currentNodeView) {
		if(currentNodeView && currentNodeView.constructor.name == 'HTMLDivElement') {
			if(currentNodeView.firstChild.dataset.nodeid === nodeId) {
				return currentNodeView;
			}
		}
		currentNodeView = currentNodeView.nextSibling;
	}
}
