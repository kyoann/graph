function context_append(container, contextId, nodesModels, createDblClickCB) {
    var contextDiv = ui_createUI(contextId, 'Context');
    var contentDiv = ui_getContentDiv(contextDiv);

    var d1 = document.createElement('div');
    var d2 = document.createElement('div');
    d1.id = contextId + 'Contexts';
    d2.id = contextId + 'Context';
    d1.className = 'column';
    d2.className = 'column';

    contentDiv.appendChild(d1);
    contentDiv.appendChild(d2);
    container.appendChild(contextDiv);

    contextDiv.addEventListener('dragover', function (event) {
        event.preventDefault();
    }, false);

    var createNodeSelectedCB = function (aNodeDiv) {
        return function (e) {
			model_NoContext(function() {
				getNeighbours(aNodeDiv.dataset.nodeid, function (neighbours) {
					d2.innerHTML = "";
					node_addNodes(d2, neighbours, d2.id);
					node_highLightNodeDiv(aNodeDiv)
					model_setContext(aNodeDiv.dataset.nodeid)
				});
			})
        };
    };

    var context_dropNodeOnContexts = function (ev) {
        ev.stopPropagation();
        ev.preventDefault();

        var draggedNodeViewId = ev.dataTransfer.getData('Text');
        var draggedNodeView = document.querySelector('#' + draggedNodeViewId);
        var draggedNodeId = draggedNodeView.dataset.nodeid;

        getNode(draggedNodeId, function (node) {
            model_addContext(node, function (contextsNode) {
                var nodeDiv = node_addNode(d1, node, d1.id);
                var nodeSelectedCB = createNodeSelectedCB(nodeDiv);
                nodeDiv.addEventListener('click', nodeSelectedCB);
            });
        });
    };

    var context_dropNodeOnContext = function (ev) {
        ev.stopPropagation();
        ev.preventDefault();

        var draggedNodeViewId = ev.dataTransfer.getData('Text');
        var draggedNodeView = document.querySelector('#' + draggedNodeViewId);
        var draggedNodeId = draggedNodeView.dataset.nodeid;

		var contextNodeView = node_getSelectedNodeView(d1)
		linkNodes(contextNodeView.dataset.nodeid, draggedNodeId, function(node) {
			event_nodeLinked(node)
			linkNodes(draggedNodeId, contextNodeView.dataset.nodeid, function(node) {
				event_nodeLinked(node)
			});
		});
    };

    contextDiv.addEventListener('drop', context_dropNodeOnContexts, false);
    d1.addEventListener('drop', context_dropNodeOnContexts, false);
    d2.addEventListener('drop', context_dropNodeOnContext, false);

    model_getContexts(function (contextsNodes) {
        var nodesDivs = node_addNodes(d1, contextsNodes, d1.id);

        for (var i = 0; i < nodesDivs.length; i++) {
            nodesDivs[i].addEventListener('click', createNodeSelectedCB(nodesDivs[i]));
        }
    });
    var context_nodeDnDFromContexts = function (nodeViewId) {
        var nodeView = document.querySelector('#' + nodeViewId)
        unlinkNode('contexts', nodeView.dataset.nodeid, function (contextsNode) {
            event_nodeUnlinked(contextsNode,nodeViewId)
        })
    }
    var context_nodeDnDFromContext = function (nodeViewId) {
        var nodeView = document.querySelector('#' + nodeViewId)
		var contextNodeView = node_getSelectedNodeView(d1)
        unlinkNode(contextNodeView.dataset.nodeid, nodeView.dataset.nodeid, function (contextNode) {
            event_nodeUnlinked(contextNode,nodeViewId)
        })
    }
    event_addModelEventListener("nodeDnDFrom" + d1.id, context_nodeDnDFromContexts)
    event_addModelEventListener("nodeDnDFrom" + d2.id, context_nodeDnDFromContext)
    event_addModelEventListener("nodeLinked", function(node) {
		var contextNodeView = node_getSelectedNodeView(d1)
		if(node.id == contextNodeView.dataset.nodeid) {
			getNeighbours(node.id, function (neighbours) {
				d2.innerHTML = ""
				node_addNodes(d2, neighbours, d2.id)
			})
		}
	})
    event_addModelEventListener("nodeUnlinked", function(node,n) {
		if(node.id == 'contexts') {
		    model_getContexts(function (contextsNodes) {
				var nodesDivs = node_addNodes(d1, contextsNodes, d1.id);

				for (var i = 0; i < nodesDivs.length; i++) {
					nodesDivs[i].addEventListener('click', createNodeSelectedCB(nodesDivs[i]));
				}
			});
			return
		}

		var contextNodeView = node_getSelectedNodeView(d1)
		if(!contextNodeView) {
			return
		}
		if(node.id == contextNodeView.dataset.nodeid) {
			getNeighbours(node.id, function (neighbours) {
				d2.innerHTML = ""
				node_addNodes(d2, neighbours, d2.id)
			})
		}
	})

	var labelDiv = contextDiv.querySelector('.UILabel')
	labelDiv.addEventListener('click', function(event) {
		event.stopPropagation()
		model_NoContext()
		var contextNodeView = node_getSelectedNodeView(d1)
		contextNodeView.className = 'node'
		d2.innerHTML = ''
	})
    //TODO : manage nodesModels & dblclick cb if needed
}
