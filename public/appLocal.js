function appLocal_init() {
    var mainDiv = document.querySelector('#mainDiv');
    var appLocal_editNode2;
    var appLocal_editNode = function (nodeId) {
        appLocal_editNode2(nodeId);
    }

    nodeCreator_append(mainDiv, ui_nextUIId());
    buffer_append(mainDiv, ui_nextUIId());
    getNode(0, function (rootNode) {
		var createDblClickCB = function(nodeDiv) {
			return function(event) {appLocal_editNode(nodeDiv.dataset.nodeid)};
		}
        navigator_append(mainDiv, ui_nextUIId(), [rootNode],createDblClickCB);
    });
    context_append(mainDiv, ui_nextUIId());


    search_append(mainDiv, ui_nextUIId(), appLocal_editNode);
    appLocal_editNode2 = editor_append(mainDiv, ui_nextUIId());
}

function appLocal_allowDrop(event) {
    event.preventDefault();
}

function appLocal_dropNodeOnBody(event) {
	event.stopPropagation();
	event.preventDefault();
    console.log("node dropped on body")
    var draggedNodeViewId = event.dataTransfer.getData('Text');
    var draggedNodeView = document.querySelector('#' + draggedNodeViewId);
    var draggedNodeId = draggedNodeView.dataset.nodeid;
    var uiId = draggedNodeView.dataset.uiId;

    event_eventOccured("nodeDnDFrom" + uiId, draggedNodeViewId);

    //    if (uiId === 'favorites') {
    //        unlinkNode('favorites', draggedNodeId, function () {
    //            updateUI($('#favorites'), createOnClickCB1);
    //        });
    //    }
    //    if (uiId === 'buffer') {
    //        $('#buffer').removeChild(draggedNodeView.parentNode);
    //    }
    //    if (uiId === 'context') {
    //        $('#context').querySelector('.ContextDefinition').removeChild(draggedNodeView.parentNode);
    //        contextUpdatedEvent();
    //    }
    //    if (uiId === 'contexts') {
    //        unlinkNode('contexts', draggedNodeId, function () {
    //            updateUI($('#contexts'), createOnClickCB1);
    //        });
    //    }
}