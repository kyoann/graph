var eventCallbackLinkTable = {};

function event_addModelEventListener(event,callback) {
	if(!eventCallbackLinkTable[event]) {
		eventCallbackLinkTable[event] = [];
	}
	eventCallbackLinkTable[event].push(callback);
}
function event_nodeLinked(updatedNode) {
	var callbacks = eventCallbackLinkTable.nodeLinked;
	for(var i = 0 ; i < callbacks.length ; i++) {
		callbacks[i](updatedNode);
	}
}
function event_nodeUnlinked(updatedNode,unlinkedNodeId) {
	var callbacks = eventCallbackLinkTable.nodeUnlinked;
	for(var i = 0 ; i < callbacks.length ; i++) {
		callbacks[i](updatedNode,unlinkedNodeId);
	}
}
function event_nodeCreated(createdNode) {
	var callbacks = eventCallbackLinkTable.nodeCreated;
	if(!eventCallbackLinkTable.nodeCreated) {return;}
	for(var i = 0 ; i < callbacks.length ; i++) {
		callbacks[i](createdNode);
	}
}
