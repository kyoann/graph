//TODO
var lastModificationTime = new Date();

function search_append(container, searchId, clickOnResultCB) {
    var searchDiv = ui_createUI(searchId, 'Search');
    var contentDiv = ui_getContentDiv(searchDiv);
    var input = document.createElement('input');
    var resultDiv = document.createElement('div');

    input.type = 'text';
    input.addEventListener('keydown', function (event) {
        lastModificationTime = new Date();
        setTimeout(search_createSearchTimeoutCB(lastModificationTime, searchFunction), 500);
    }, false);

    contentDiv.appendChild(input);
    contentDiv.appendChild(resultDiv);
    container.appendChild(searchDiv);

    var searchFunction = function () {
        var request = input.value;
        var createOnClickCb = function (cb, nodeId) {
            return function (e) {
                cb(nodeId);
            }
        };
        search(request, function (nodes) {
            resultDiv.innerHTML = '';
            var ul = document.createElement('ul');
            resultDiv.appendChild(ul);
            for (var i = 0; i < nodes.length; i++) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                ul.appendChild(li);
                li.appendChild(a);
                if (clickOnResultCB) {
                    a.onclick = createOnClickCb(clickOnResultCB, nodes[i].id);
                };
                a.textContent = nodes[i].label;
            }
        });
    };
}

function search_createSearchTimeoutCB(requestTime, searchFunction) {
    return function () {
        if (requestTime != lastModificationTime) {
            return;
        }
        searchFunction();
    };
}