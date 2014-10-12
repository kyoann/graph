function node_addNodes(container, nodesModels,uiId) {
	console.log("node_addNodes:"+JSON.stringify(nodesModels));
	var nodesViews = [];
	for(var i = 0, length = nodesModels.length ; i < length ; i++) {
		nodesViews.push(node_addNode(container, nodesModels[i],uiId));
	}
	return nodesViews;
}
function node_addNode(container, node, uiId) {
	console.log("node_addNode:"+JSON.stringify(node));
	var nodeDiv = document.createElement("div");
	nodeDiv.className = 'node';
	nodeDiv.id = container.id + 'Node' + node.id;
	nodeDiv.dataset.containerid = container.id;
	nodeDiv.dataset.uiId = uiId;
	nodeDiv.dataset.nodeid = node.id;
	nodeDiv.draggable = true;
	nodeDiv.addEventListener('dragstart',function(event) {node_drag(event);},false);
	nodeDiv.addEventListener('dragover',function(event) {event.preventDefault();},false);
	nodeDiv.addEventListener('drop',function(event) {node_dropOnNode(event);},false);
	nodeDiv.textContent = node.label;

	container.appendChild(nodeDiv);
	return nodeDiv;
}
function node_drag(ev) {
	ev.dataTransfer.setData("Text",ev.target.id);
}
function node_dropOnNode(ev) {
	console.log("node_dropOnNode");
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
	console.log("end of node_dropOnNode");
}
function node_highLightNodeDiv(nodeDiv) {
	var containerView = document.querySelector('#' + nodeDiv.dataset.containerid);

	var selectedNode = containerView.querySelector('.selectedNode');
	if(selectedNode) {
		selectedNode.className = 'node';
	}

	nodeDiv.className = 'selectedNode';
}
function node_getSelectedNodeView(container) {
	var selectedNodeView = container.querySelector('.selectedNode');
	return selectedNodeView;
}
function node_getNodeView(container,nodeId) {
	var nodes = container.querySelectorAll('.node');
	for(var i = 0 ; i < nodes.length ; i++) {
		if(nodes[i].id === nodeId) {
			return nodes[i];
		}
	}
	//TODO
	nodes = container.querySelectorAll('.selectedNode');
	for(var i = 0 ; i < nodes.length ; i++) {
		if(nodes[i].id === nodeId) {
			return nodes[i];
		}
	}
}