var socket = io.connect('http://localhost:3000');
socket.on('connected',function(data) {
	//TODO
	document.querySelector("#connexionDivId").innerHTML='connected';
	updateUI($('#favorites'));
	updateUI($('#context'));
});
function getNeighbours(nodeId,done) {
	socket.emit('getNeighbours',{nodeId:nodeId},done);
}
function createNode(nodeLabel,context,done) {
	socket.emit('createNode',{label:nodeLabel,context:context},done);
}
function linkNodes(nodeId1,nodeId2,done) {
	socket.emit('linkNodes',{nodeId1:nodeId1,nodeId2:nodeId2},done);
}
function unlinkNode(parentNodeId, nodeId, done) {
	socket.emit('unlinkNode',{parentNodeId:parentNodeId,nodeId:nodeId},done);
}
function getNode(nodeId,done) {
	socket.emit('getNode',{nodeId:nodeId},done);
}
function getNodeData(nodeId,done) {
	socket.emit('getNodeData',{nodeId:nodeId},done);
}
function getNodeFiles(nodeId,done) {
	socket.emit('getNodeFiles',{nodeId:nodeId},done);
}
function saveNodeLabel(nodeId,label,done) {
	socket.emit('saveNodeLabel',{nodeId:nodeId,label:label},done);
}
function saveNodeData(nodeId,data,done) {
	socket.emit('saveNodeData',{nodeId:nodeId,data:data},done);
}
function linkFilesWithNode(nodeId,filesNames, done) {
	socket.emit('linkFilesWithNode',{nodeId:nodeId,filesNames:filesNames},done);
}
function addNodeToFavorites(nodeId,done) {
	socket.emit('linkNodes',{nodeId1:'favorites',nodeId2:nodeId},done);
}
function search(request,done) {
	socket.emit('dataSearch',{request:request},done);
}
function getContextResultSet(context, done) {
	socket.emit('getContextResultSet',context,done);
}
