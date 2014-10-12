/*
{
	neighbours = [];
	label = "node 1";	
}
*/

function lsDeserializeNode(nodeId) {
	var nodeStr = localStorage.getItem("node"+nodeId);
	console.log("deserialize "+nodeId+" "+nodeStr);
	if(!nodeStr) {
		return undefined;
	}
	var node = JSON.parse(nodeStr);
	if(!node.neighbours) {
		node.neighbours = [];
	}
	return node;
}
function lsSerializeNode(node) {
	var nodeStr = JSON.stringify(node);
	console.log("serializing:"+nodeStr);
	localStorage.setItem("node"+node.id,nodeStr);
}

function modelInit() {
	if(!localStorage.node0) {
		var node = {};
		node.id = 0;
		node.label = "Root";
		
		localStorage.node0 = JSON.stringify(node);
		localStorage.lastAttributedId = 0;
		console.log(JSON.stringify(localStorage));
	}
}
modelInit();

function getNeighbours(nodeId,done) {
	var node = lsDeserializeNode(nodeId);
	lsGetNodesById(node.neighbours,[],0,function(neighbours) {
		done(neighbours);
	});
}

function lsGetNodesById(nodesIds,nodes,i,done) {
	getNode(nodesIds[i],function(node) {
		if(i >= nodesIds.length) {
			done(nodes);
		} else {
			nodes.push(node);
			lsGetNodesById(nodesIds,nodes,i+1,done);
		}
	});
}

function createNode(nodeLabel,context,done) {
//	socket.emit('createNode',{label:nodeLabel,context:context},done);
	
	var node = {};
	node.id = localStorage.lastAttributedId++ + 1;
	node.label = nodeLabel;
	lsSerializeNode(node);
	done(node);
	console.log("creation of node "+node.id);
}
function linkNodes(nodeId1,nodeId2,done) {
//	socket.emit('linkNodes',{nodeId1:nodeId1,nodeId2:nodeId2},done);
	console.log("linkNodes");
	var node1 = lsDeserializeNode(nodeId1);
	node1.neighbours.push(nodeId2);

	lsSerializeNode(node1);
	done(node1);
}
function unlinkNode(parentNodeId, nodeId, done) {
//	socket.emit('unlinkNode',{parentNodeId:parentNodeId,nodeId:nodeId},done);
	var node = lsDeserializeNode(parentNodeId);
	var i = node.neighbours.indexOf(nodeId);
	node.neighbours.splice(i,1);
	lsSerializeNode(node);
	done(node);	
}
function setNodeNeighboursIds(request,done) {
//	socket.emit('setNodeNeighboursIds',request,done);
	var node = lsDeserializeNode(request.nodeId);
	node.neighbours = request.neighboursIds;
	done(null,node);
}
var numberRe = /^\d+$/;
function getNode(nodeIdOrLabel,done) {
	console.log("getNode:"+nodeIdOrLabel);
	if(numberRe.test(nodeIdOrLabel)) {
		var node = lsDeserializeNode(nodeIdOrLabel);
		done(node);
	} else {
		getNodeUsingLabel(nodeIdOrLabel,function(nodes) {
			if(nodes.length ==1) {
				done(nodes[0]); 
			}
			else{
				done(null);
			}
		});
	}
}
function getNodeUsingLabel(label,done) {
//	socket.emit('getNodeUsingLabel',{label:label},done);
	console.log("getNodeUsingLabel:"+label);
	var nodes = [];
	for(x in localStorage) {
		//TODO
		var i = x.indexOf("node");
		if(i !== 0) {
			continue;
		}
		var node = lsDeserializeNode(x.substring(4));

		console.log("getNodeUsingLabel:"+JSON.stringify(node));
		if(node && node.label.search(label) !== -1) {
			nodes.push(node);
		}
	}
	done(nodes);
}
function getNodeData(nodeId,done) {
//	socket.emit('getNodeData',{nodeId:nodeId},done);
	console.log("getNodeData:"+JSON.stringify(nodeId));
	var node = lsDeserializeNode(nodeId);
	done(node.data);
}
function getNodeFiles(nodeId,done) {
//	socket.emit('getNodeFiles',{nodeId:nodeId},done);
	var node = lsDeserializeNode(nodeId);
	done(null,node.files);
}
function saveNodeLabel(nodeId,label,done) {
//	socket.emit('saveNodeLabel',{nodeId:nodeId,label:label},done);
	var node = lsDeserializeNode(nodeId);
	node.label = label;
	lsSerializeNode(node);
	done(node);
}
function saveNodeData(nodeId,data,done) {
//	socket.emit('saveNodeData',{nodeId:nodeId,data:data},done);
	var node = lsDeserializeNode(nodeId);
	node.data = data;
	lsSerializeNode(node);
	console.log("savenodedata:"+data);
	done(node);
}
function linkFilesWithNode(nodeId,filesNames, done) {
//	socket.emit('linkFilesWithNode',{nodeId:nodeId,filesNames:filesNames},done);
	var node = lsDeserializeNode(nodeId);
	//node.files
	//TODO
}
function addNodeToFavorites(nodeId,done) {
//	socket.emit('linkNodes',{nodeId1:'favorites',nodeId2:nodeId},done);
	var favorites = lsDeserializeNode('favorites');
	if(!favorites) {
		favorites = {id:'favorites', label:'favorites',neighbours:[]};
		lsSerializeNode(favorites);
	}
	linkNodes('favorites', nodeId, function(favoritesNode) {done(favoritesNode);});	
}
function addNodeToContexts(nodeId,done) {
//	socket.emit('linkNodes',{nodeId1:'contexts',nodeId2:nodeId},done);
}
function search(request,done) {
//	socket.emit('dataSearch',{request:request},done);
}
function getContextResultSet(context, done) {
//	socket.emit('getContextResultSet',context,done);
}
