function buffer_append(container, bufferId, nodesModels, createDblClickCB) {
    var bufferDiv = ui_createUI(bufferId, 'Buffer');

    container.appendChild(bufferDiv);

    bufferDiv.addEventListener('dragover', function (event) {
        event.preventDefault();
    }, false);

    var buffer_dropNodeOnbuffer = function (ev) {
        ev.stopPropagation();
        ev.preventDefault();

        var draggedNodeViewId = ev.dataTransfer.getData('Text');
        var draggedNodeView = document.querySelector('#' + draggedNodeViewId);
        var draggedNodeId = draggedNodeView.dataset.nodeid;

        getNode(draggedNodeId, function (node) {
            node_addNode(ui_getContentDiv(bufferDiv), node, bufferId);
        });
    }

    var buffer_nodeDnDFromBuffer = function (nodeViewId) {
        draggedNodeView = document.querySelector('#' + nodeViewId);
        ui_getContentDiv(bufferDiv).removeChild(draggedNodeView);
    };
    event_addModelEventListener("nodeDnDFrom" + bufferId, buffer_nodeDnDFromBuffer);
    bufferDiv.addEventListener('drop', buffer_dropNodeOnbuffer, false);

    //TODO : manage nodesModels & dblclick cb if needed
}