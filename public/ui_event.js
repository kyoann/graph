var eventCallbackLinkTable = {};

function event_addModelEventListener(event,callback) {
	if(!eventCallbackLinkTable[event]) {
		eventCallbackLinkTable[event] = [];
	}
	eventCallbackLinkTable[event].push(callback);
}
function event_nodeLinked(updatedNode) {
	var callbacks = eventCallbackLinkTable.nodeLinked;
	if(!callbacks) {return;}
	for(var i = 0 ; i < callbacks.length ; i++) {
		console.log("nodeLinked callback:"+JSON.stringify(callbacks[i]));
		callbacks[i](updatedNode);
	}
}
function event_nodeUnlinked(updatedNode,unlinkedNodeId) {
	var callbacks = eventCallbackLinkTable.nodeUnlinked;
	if(!callbacks) {return;}
	for(var i = 0 ; i < callbacks.length ; i++) {
		callbacks[i](updatedNode,unlinkedNodeId);
	}
}
function event_nodeCreated(createdNode) {
	var callbacks = eventCallbackLinkTable.nodeCreated;
	if(!callbacks) {return;}
	if(!eventCallbackLinkTable.nodeCreated) {return;}
	for(var i = 0 ; i < callbacks.length ; i++) {
		callbacks[i](createdNode);
	}
}
function event_nodeLabelModified(updatedNode) {
	var callbacks = eventCallbackLinkTable.nodeLabelModified;
	if(!callbacks) {return;}
	for(var i = 0 ; i < callbacks.length ; i++) {
		console.log("nodeLabelModified callback:"+JSON.stringify(callbacks[i]));
		callbacks[i](updatedNode);
	}
}
function event_nodeDataModified(updatedNode) {
	var callbacks = eventCallbackLinkTable.nodeDataModified;
	if(!callbacks) {return;}
	for(var i = 0 ; i < callbacks.length ; i++) {
		console.log("nodeDataModified callback:"+JSON.stringify(callbacks[i]));
		callbacks[i](updatedNode);
	}
}