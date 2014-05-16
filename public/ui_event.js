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
