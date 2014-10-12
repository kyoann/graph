function navigator_append(container,navigatorId,nodeModel) {
	var navigatorDiv = ui_createUI(navigatorId,'');
	/*navigatorDiv.id = navigatorId;
	navigatorDiv.className = 'UI';
	var labelDiv = document.createElement('div');
	labelDiv.className = 'UILabel';
	labelDiv.innerHTML = 'Navigator';
	var contentDiv = document.createElement('div');
	contentDiv.className = 'UIContent';
	container.appendChild(navigatorDiv);
	navigatorDiv.appendChild(labelDiv);
	navigatorDiv.appendChild(contentDiv);
       */
	container.appendChild(navigatorDiv);
	event_addModelEventListener('nodeLinked',navigator_createNodeLinkedCB(navigatorDiv));
	event_addModelEventListener('nodeUnlinked',navigator_createNodeUnlinkedCB(navigatorDiv));

	navigatorDiv.addEventListener('dragover',function(event) {event.preventDefault();},false);
	navigatorDiv.addEventListener('drop',function(event) {navigator_dropNodeOnNavigator(event);},false);

	navigator_init(navigatorDiv,nodeModel);
}
function navigator_dropNodeOnNavigator(ev) {
	ev.stopPropagation();
	ev.preventDefault();

	var draggedNodeViewId = ev.dataTransfer.getData('Text');
	var draggedNodeView = document.querySelector('#'+draggedNodeViewId);
	var draggedNodeId = draggedNodeView.dataset.nodeid;
	var draggedNodeViewParentId = draggedNodeView.dataset.parentNodeViewId;
	if(!draggedNodeViewParentId) {
		return;
	}
	var draggedNodeParentView = document.querySelector('#'+draggedNodeViewParentId);
	var draggedNodeParentId = draggedNodeParentView.dataset.nodeid;

	if(draggedNodeParentId == undefined) {
		return false;
	}

	unlinkNode(draggedNodeParentId, draggedNodeId, function(updatedNode,unlinkedNodeId) {
		event_nodeUnlinked(updatedNode,unlinkedNodeId);
	});

}
function navigator_selected(navigatorDiv,nodeDiv,eraseColumnsAfter,done) {
	getNeighbours(nodeDiv.dataset.nodeid,function(neighbours){
		node_highLightNodeDiv(nodeDiv);
		var nextColumnDiv = navigator_getNextColumnDiv(navigatorDiv,nodeDiv);
		navigator_initColumn(nextColumnDiv);
		var nodesViews = node_addNodes(nextColumnDiv, neighbours,nodeDiv);
		for(var i = 0 ; i < nodesViews.length ; i++) {
			nodesViews[i].addEventListener('click',(function(nodeView) {return function() {navigator_selected(navigatorDiv,nodeView,true);};})(nodesViews[i]) );
			nodesViews[i].dataset.parentNodeViewId = nodeDiv.id;
		}
		if(eraseColumnsAfter == true) {
			navigator_eraseColumnsAfter(navigatorDiv,nextColumnDiv);
		}
		if(done) { done(); }
	});
}
var re = /(\d+)$/;
function navigator_getNextColumnDiv(navigatorDiv,nodeDiv) {
	var columnDiv = $('#'+nodeDiv.dataset.containerid);
	var res = re.exec(columnDiv.id);
	if(!res || res.length < 2) {
		return;
	}
	var colNumber = parseInt(res[1]);
	var nextColumnDiv = columnDiv.nextSibling;
	if(nextColumnDiv == undefined || nextColumnDiv.className != 'column') {
		nextColumnDiv = document.createElement("div");
		nextColumnDiv.className = 'column';
		nextColumnDiv.id = navigatorDiv.id+'col' + (colNumber + 1);
		columnDiv.parentNode.appendChild(nextColumnDiv);
	}
	return nextColumnDiv;	
}
function navigator_initColumn(columnDiv) {
	columnDiv.innerHTML = '';

}

function navigator_eraseColumnsAfter(navigatorDiv,columnDiv) {
	while(columnDiv.nextSibling) {
		columnDiv.parentNode.removeChild(columnDiv.nextSibling);
	}
}

function navigator_init(navigatorDiv,nodeModel) {
	navigatorDiv.querySelector('.UIContent').innerHTML = '';
	var column0 = document.createElement('div');
	column0.id = navigatorDiv.id+'col0';
	column0.className = 'column';
	navigatorDiv.querySelector('.UIContent').appendChild(column0);
	var nodeDiv = node_addNode(column0,nodeModel,navigatorDiv.id);
	nodeDiv.addEventListener('click',function() {navigator_selected(navigatorDiv,nodeDiv,true)});
}

function navigator_createNodeUnlinkedCB(navigatorDiv) {

	return function(updatedNode,unlinkedNodeId) {
		//for each col
		//	if selected node = parentnode
		//		save next col selection
		//		redraw next col
		//		if next col selection is nodeid
		//			erase cols after next col
		//		else
		//			reselect node
		var colsList = navigatorDiv.querySelectorAll('.column');	   

		for(var i = 0 ; i < colsList.length ; i++) {
			//alert("treating " + colsList.item(i).id);
			var selectedNode = node_getSelectedNodeView(colsList.item(i));

			if(selectedNode != undefined && selectedNode.dataset.nodeid == updatedNode.id) {
				if(i + 1 < colsList.length) {
					var selectedNodeView2 = node_getSelectedNodeView(colsList.item(i + 1));
					var selectedNodeId2;
					if(selectedNodeView2) {
						selectedNodeId2 = selectedNodeView2.dataset.nodeid;	
					}
				}
				navigator_selected(navigatorDiv,selectedNode);
				if(selectedNodeId2 != undefined) {
					if(selectedNodeId2 == unlinkedNodeId) {
						navigator_eraseColumnsAfter(navigatorDiv,colsList.item(i + 1));
						break;
					}	
					else {
						node_highLightNodeDiv(node_getNodeView(colsList.item(i+1),selectedNodeId2));
					}
				}
			}
		}
	}	
}	
function navigator_createNodeLinkedCB(navigatorDiv) {

	return function(updatedNode) {
		//for each col
		//  if selected node = updated node
		//     get next column, save the selected node, redraw the nodes, select the node
		var colsList = navigatorDiv.querySelectorAll('.column');	   
		for(var i = 0 ; i < colsList.length ; i++) {
			//alert("treating " + colsList.item(i).id);
			var selectedNode = node_getSelectedNodeView(colsList.item(i));

			if(selectedNode && selectedNode.dataset.nodeid == updatedNode.id) {
				if(i + 1 < colsList.length) {
					var selectedNodeView2 = node_getSelectedNodeView(colsList.item(i + 1));
					var selectedNodeId2;
					if(selectedNodeView2) {
						selectedNodeId2 = selectedNodeView2.dataset.nodeid;	
					}
				}
				navigator_selected(navigatorDiv,selectedNode);
				if(selectedNodeId2 != undefined) {
					node_highLightNodeDiv(node_getNodeView(colsList.item(i+1),selectedNodeId2));
				}
			}
		}
	}
}
