var $ = function(s) { return document.querySelector(s);}
//var $ = document.querySelector;


function selected(nodeDiv) {
	getNeighbours(nodeDiv.dataset.nodeid,function(neighbours){
		highLightNodeDiv(nodeDiv);
		var nextColumnDiv = getNextColumnDiv(nodeDiv);
		initColumn(nextColumnDiv);
		addNodes(nextColumnDiv, neighbours.nodes,nodeDiv);
		eraseColumnsAfter(nextColumnDiv);
	});
}

function selectedWithoutErase(nodeDiv) {
	getNeighbours(nodeDiv.dataset.nodeid,function(neighbours){
		highLightNodeDiv(nodeDiv);
		var nextColumnDiv = getNextColumnDiv(nodeDiv);
		initColumn(nextColumnDiv);
		addNodes(nextColumnDiv, neighbours.nodes,nodeDiv);
	});
}

function eraseColumnsAfter(columnView) {
	while(columnView.nextSibling) {
		getColumnsUIContent().removeChild(columnView.nextSibling);
	}
}
function initColumns(nodeModel) {
	getColumnsUIContent().innerHTML = '';
	//$('#col0').innerHTML = ''; 
	var column0 = document.createElement('div');
	column0.id = 'col0';
	column0.className = 'column';
	getColumnsUIContent().appendChild(column0);
	addNode($('#col0'),nodeModel,null);
}

function highLightNodeDiv(nodeDiv) {
	var colNumber = parseInt(nodeDiv.dataset.containerid.substr(3));
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
function getNodeView(columnView,nodeId) {
	var currentNodeView = columnView.firstChild;
	while(currentNodeView) {
		if(currentNodeView && currentNodeView.constructor.name == 'HTMLDivElement') {
			if(currentNodeView.firstChild.dataset.nodeid === nodeId) {
				return currentNodeView;
			}
		}
		currentNodeView = currentNodeView.nextSibling;
	}
}

function getNextColumnDiv(nodeDiv) {
	var colNumber = parseInt(nodeDiv.dataset.containerid.substr(3));
	var nextColumnDiv = document.querySelector('#col'+(colNumber+1));
	if(nextColumnDiv == undefined) {
		nextColumnDiv = document.createElement("div");
		nextColumnDiv.className = 'column';
		nextColumnDiv.id = 'col' + (colNumber + 1);
		getColumnsUIContent().appendChild(nextColumnDiv);
	}
	return nextColumnDiv;	
}
function initColumn(columnDiv) {
	columnDiv.innerHTML = '';

}
function addNodes(container, nodesModels,parentNodeView,uiId) {
	var nodesViews = [];
	for(var i = 0, length = nodesModels.length ; i < length ; i++) {
		nodesViews.push(addNode(container, nodesModels[i],parentNodeView,uiId));
	}
	return nodesViews;
}
function addNode(container, node, parentNodeView, uiId) {
	var nodeDiv = document.createElement("div");
	nodeDiv.className = 'node';
	nodeDiv.id = container.id + 'Node' + node.id;
	nodeDiv.dataset.containerid = container.id;
	nodeDiv.dataset.uiId = uiId;
	if(parentNodeView != undefined) {
		nodeDiv.dataset.parentNodeViewId = parentNodeView.id;
	}
	nodeDiv.onclick = function() { selected(this); showInNodeEditor(nodeDiv.dataset.nodeid);};			
	//nodeDiv.ondblclick= function() { showInNodeEditor(nodeDiv.dataset.nodeid);};			
	nodeDiv.dataset.nodeid = node.id;
	nodeDiv.draggable = true;
	nodeDiv.addEventListener('dragstart',function() {drag(event);},false);
	nodeDiv.addEventListener('dragover',function() {allowdrop(event);},false);
	nodeDiv.addEventListener('drop',function() {dropOnNode(event);},false);
	nodeDiv.textContent = node.label;

	var outerNodeDiv = document.createElement("div");
	outerNodeDiv.className = 'nodeWrapper';
	outerNodeDiv.appendChild(nodeDiv);
	container.appendChild(outerNodeDiv);
	return nodeDiv;
}
function getNodeEditor() {
	return document.querySelector('#nodeEditor');
}

var nodeInNodeEditor;
function showInNodeEditor(nodeId) {
	//var nodeId = nodeView.dataset.nodeid;
	getNode(nodeId,function(node) {
		getNodeData(nodeId,function(data) {
			getNodeFiles(nodeId,function(err,updatedFiles) {	
				nodeInNodeEditor = node;
				var nodeEditorLabelView = document.querySelector('#nodeEditorLabel');
				var nodeEditorDataView = document.querySelector('#nodeEditorData');
				nodeEditorLabelView.value = node.label;
				nodeEditorDataView.value = data;
				$('#nodeEditor').style.display='block';
				updateNodeAfterFileLinkAdded(updatedFiles);
			});
		});
	});
}
function saveNodeDataView() {
	saveNodeData(nodeInNodeEditor.id,$('#nodeEditorData').value,function(err) {
	});
}
function addLinkView() {
	var filesNames = [];
	var links = $('#filesLinksUL').querySelectorAll('a');
	for(var i = 0 ; i < links.length ; i++) {
		filesNames.push({href:links.item(i).href,value:links.item(i).textContent});
	}
	filesNames.push({href:$('#newLink').value,value:$('#newLink').value});
	linkFilesWithNode(nodeInNodeEditor.id,filesNames,function(err,updatedNodeFiles) {
		updateNodeAfterFileLinkAdded(updatedNodeFiles);
		$('#newLink').value='';
	});
}
function updateNodeAfterFileLinkAdded(updatedNodeFiles) {
	if(updatedNodeFiles.nodeId != nodeInNodeEditor.id) {
		return;
	}
	var ul = $('#filesLinksUL');
	//var lis = ul.querySelector('li');
	//	for(var i = 0 ; i < lis.length ; i++) {
	//		ul.removeChild
	//	}	
	//for(var child = ul.firstChild ; child ; child = child.nextSibling) {
	//	ul.removeChild(child);
	//}
	ul.innerHTML = '';

	if(!updatedNodeFiles.filesNames) {
		return;
	}
	for(var i = 0 ; i < updatedNodeFiles.filesNames.length ; i++) {
		var file = updatedNodeFiles.filesNames[i];
		var li = document.createElement('li');
		var a = document.createElement('a');
		a.href = file.href;
		a.textContent = file.value;
		a.target='_blank';
		ul.appendChild(li);
		li.appendChild(a);
	}
}



function drag(ev) {
	ev.dataTransfer.setData("Text",ev.target.id);
}
function allowdropColsView(ev) {
	ev.preventDefault();
}
function allowdrop(ev) {
	if(ev.target.id === 'buffer')
	{
		ev.preventDefault();
	}
	if(ev.target.id === 'favorites')
	{
		ev.preventDefault();
	}
	if(ev.target.parentNode.id == 'colsView')
	{
		ev.preventDefault();
	}
	if(ev.target.parentNode.id === 'buffer')
	{
		ev.preventDefault();
	}
	if(ev.target.parentNode.id === 'context')
	{
		ev.preventDefault();
	}
	if(ev.target.dataset.nodeid !== undefined) {
		ev.dataTransfer.dropEffect = 'link';
		ev.preventDefault();
	}
	if(ev.target == document.body) {
		ev.preventDefault();
	}
}
function dropNodeOnBuffer(container,ev) {
	ev.stopPropagation();
	var draggedNodeViewId = ev.dataTransfer.getData('Text');
	var draggedNodeView = document.querySelector('#'+draggedNodeViewId);
	var draggedNodeId = draggedNodeView.dataset.nodeid;
	var currentNode = container.firstChild;
	while(currentNode) {
		if(currentNode.dataset) {
			if(currentNode.dataset.nodeid === draggedNodeId) {
				return false;
			}
		}

		currentNode = currentNode.nextSibling;
	}
	ev.preventDefault();
	getNode(draggedNodeId,function(node) {
		var nodesViews = addNodes(container, [node], null,"buffer");
		nodesViews[0].onclick = function() {showInNodeEditor(nodesViews[0].dataset.nodeid);initColumns(node);}; 
	});
}
function dropNodeOnUI(container,ev) {
	ev.stopPropagation();
	var draggedNodeViewId = ev.dataTransfer.getData('Text');
	var draggedNodeView = document.querySelector('#'+draggedNodeViewId);
	var draggedNodeId = draggedNodeView.dataset.nodeid;
	var currentNode = container.firstChild;
	while(currentNode) {
		if(currentNode.dataset) {
			if(currentNode.dataset.nodeid === draggedNodeId) {
				return false;
			}
		}

		currentNode = currentNode.nextSibling;
	}
	ev.preventDefault();
	if(container.id === 'favorites') {
		addNodeToFavorites(draggedNodeId,function(favoritesNode){
			updateUI(container);
		});
	}
	if(container.id === 'context') {
		addNodeToContext(draggedNodeId,function(contextNodes){
			updateUI(container);
		});
	}
	//getNode(draggedNodeId,function(node) {
	//	var nodesViews = addNodes(container, [node], null);
	//	nodesViews[0].onclick = function() {showInNodeEditor(nodesViews[0]);}; 
	//});
}
//<<<<<<< HEAD
function updateUI(container) {
	var UIContentDiv = container.querySelector('.UIContent');
	UIContentDiv.innerHTML = '';
	getNeighbours(container.id,function(nodesModels){
		var nodesViews = addNodes(UIContentDiv,nodesModels.nodes,null,'favorites');
		for(var i = 0 ; i < nodesViews.length ; i++) {
			nodesViews[i].onclick = createOnClickCB1(nodesModels.nodes[i]);
		}
	});
}
function createOnClickCB1(nodeModel) {
	return function() {
		showInNodeEditor(nodeModel.id);
		initColumns(nodeModel);
	}; 
	/*
=======
function updateFavorites() {
		var favoritesDiv = $('#favorites');
		var favoritesContentDiv = favoritesDiv.querySelector('.UIContent');
		favoritesContentDiv.innerHTML = '';

		getNeighbours('Favorites',function(favoritesNodes){
			var nodesViews = addNodes(favoritesContentDiv,favoritesNodes.nodes,null,'favorites');
			for(var i = 0 ; i < nodesViews.length ; i++) {
				//var nodeView = nodesViews[i];
				nodesViews[i].onclick = createOnClickCB1(favoritesNodes.nodes[i]);
			}
		});
}
function createOnClickCB1(nodeModel) {
			return function() {
				showInNodeEditor(nodeModel.id);
				initColumns(nodeModel);
			}; 
>>>>>>> SearchTools
*/
}
function dropNodeOnBody(ev) {
	var draggedNodeViewId = ev.dataTransfer.getData('Text');
	var draggedNodeView = document.querySelector('#'+draggedNodeViewId);
	var draggedNodeId = draggedNodeView.dataset.nodeid;
	var uiId = draggedNodeView.dataset.uiId;
	if(uiId === 'favorites') {
		unlinkNode('favorites',draggedNodeId,function() {
			updateUI($('#favorites'));
		});
	}
	if(uiId === 'buffer') {
		$('#buffer').removeChild(draggedNodeView.parentNode);
	}
}

function dropNodeOnColsView(ev) {
	var draggedNodeViewId = ev.dataTransfer.getData('Text');
	var draggedNodeView = document.querySelector('#'+draggedNodeViewId);
	var draggedNodeId = draggedNodeView.dataset.nodeid;
	var draggedNodeViewParentId = draggedNodeView.dataset.parentNodeViewId;
	var draggedNodeParentView = document.querySelector('#'+draggedNodeViewParentId);
	var draggedNodeParentId = draggedNodeParentView.dataset.nodeid;

	if(draggedNodeParentId == undefined) {
		return false;
	}

	unlinkNode(draggedNodeParentId, draggedNodeId, function() {
		updateViewAfterNodeUnlinked(draggedNodeParentId, draggedNodeId);	
	});

	ev.stopPropagation();
}
function dropOnNode(ev) {

	if(ev.dataTransfer.types[0] == 'Files') {
		ev.stopPropagation();

		var droppedOnNode = ev.target;
		var filesNames = [];
		var files = ev.dataTransfer.files;
		for(var i = 0 ; i < files.length ; i++) {
			//	filesNames.push(files[i].name);
			alert("toto");
			alert(window.URL.createObjectURL(files[i]));
			filesNames.push(window.URL.createObjectURL(files[i]));
		}
		//TODO
		linkFilesWithNode(droppedOnNode.dataset.nodeid,filesNames, function() {});
	}
	var draggedNodeViewId = ev.dataTransfer.getData('Text');
	var draggedNodeView = document.querySelector('#'+draggedNodeViewId);
	var draggedNodeId = draggedNodeView.dataset.nodeid;
	var droppedOnNode = ev.target;
	if(draggedNodeId === droppedOnNode.dataset.nodeid) {
		return false;
	}
	linkNodes(droppedOnNode.dataset.nodeid,draggedNodeId, function(updatedNode) {
		updateViewAfterNodeLinked(updatedNode);	
	});
	linkNodes(draggedNodeId,droppedOnNode.dataset.nodeid, function(updatedNode) {
		updateViewAfterNodeLinked(updatedNode);	
	});
	ev.stopPropagation();
}

function getColumnsView() {
	return document.querySelector('#colsView');
}
function getColumnsUIContent() {
	return document.querySelector('#colsView').querySelector('.UIContent');
}
function updateViewAfterNodeUnlinked(parentNodeId, nodeId) {
	//for each col
	//	if selected node = parentnode
	//		save next col selection
	//		redraw next col
	//		if next col selection is nodeid
	//			erase cols after next col
	//		else
	//			reselect node
	var columnsView = getColumnsView();
	var colsList = columnsView.querySelectorAll('.column');	   
	for(var i = 0 ; i < colsList.length ; i++) {
		//alert("treating " + colsList.item(i).id);
		var selectedNode = getSelectedNodeView(colsList.item(i));

		if(selectedNode != undefined && selectedNode.dataset.nodeid == parentNodeId) {
			if(i + 1 < colsList.length) {
				var selectedNodeView2 = getSelectedNodeView(colsList.item(i + 1));
				var seletedNodeId2;
				if(selectedNodeView2) {
					selectedNodeId2 = selectedNodeView2.dataset.nodeid;	
				}
			}
			selectedWithoutErase(selectedNode);

			if(selectedNodeId2 != undefined) {
				if(selectedNodeId2 == nodeId) {
					eraseColumnsAfter(colsList.item(i + 1));
					break;
				}	
				else {
					highLightNodeDiv(getNodeView(colsList.item(i+1),selectedNodeId2).firstChild);
				}
			}
		}
	}
}	
function updateViewAfterNodeLinked(updatedNode) {
	var columnsView = getColumnsView();
	//for each col
	//  if selected node = updated node
	//     get next column, save the selected node, redraw the nodes, select the node
	var colsList = columnsView.querySelectorAll('.column');	   
	for(var i = 0 ; i < colsList.length ; i++) {
		//alert("treating " + colsList.item(i).id);
		var selectedNode = getSelectedNodeView(colsList.item(i));

		if(selectedNode.dataset.nodeid == updatedNode.id) {
			if(i + 1 < colsList.length) {
				var selectedNodeView2 = getSelectedNodeView(colsList.item(i + 1));
				var seletedNodeId2;
				if(selectedNodeView2) {
					selectedNodeId2 = selectedNodeView2.dataset.nodeid;	
				}
			}
			selectedWithoutErase(selectedNode);
			if(selectedNodeId2 != undefined) {
				highLightNodeDiv(getNodeView(colsList.item(i+1),selectedNodeId2).firstChild);
			}
		}
	}
}
function getSelectedNodeView(columnView) {
	var selectedNodeView = columnView.querySelector('.selectedNode');
	return selectedNodeView;
}
function createNodeView() {
	console.log("create view");
	var label = document.querySelector('#newNodeInputText').value;	
	createNode(label,function(node) {
		addNode(document.querySelector('#newNodeDiv'),node);
	});	
}
function searchResults() {
	var request = $('#searchRequest').value;
	search(request,function(nodes) {
		var resultsDiv = $('#searchResults');
		resultsDiv.innerHTML = '';
		var ul = document.createElement('ul');
		resultsDiv.appendChild(ul);
		for(var i = 0 ; i < nodes.length ; i++) {
			var li = document.createElement('li');
			var a = document.createElement('a');
			ul.appendChild(li);
			li.appendChild(a);
			a.onclick = createOnClickCB1(nodes[i]); 
			a.textContent = nodes[i].label;
		}
	});
}
var lastModificationTime = new Date(); 
function searchRequestModified() {
	lastModificationTime = new Date();
	setTimeout(createSearchTimeoutCB(lastModificationTime),500);
}
function createSearchTimeoutCB(requestTime) {
	return function() {
		if(requestTime != lastModificationTime) {
			return;
		}
		searchResults();
	};
}

function switchContextDiv() {
	if($('#contextCreationDiv').style.display === 'none') {
		$('#contextSelectionDiv').style.display = 'none';
		$('#contextCreationDiv').style.display = 'block';
	}
	else {
		if($('#contextSelectionDiv').style.display === 'none') {
			$('#contextCreationDiv').style.display = 'none';
			$('#contextSelectionDiv').style.display = 'block';
		}
	}
}
function createContext() {
}
