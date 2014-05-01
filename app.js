var express = require('express');
var http = require('http');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server,{log:false}),
    fs = require('fs');

app.configure(function(){
	app.use(express.static(__dirname + '/public'))});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//var graphRepo = 'H:\\graph\\graphRepository';
var graphRepo = '/Users/Johan/work/webProjects/graph/graphRepository';

var indexData = fs.readFileSync(graphRepo + '/dataIndex.json',["utf8"]);
var dataIndex = JSON.parse(indexData);
var labelsIndexData = fs.readFileSync(graphRepo + '/labelsIndex.json',["utf8"]);
var labelsIndex = JSON.parse(labelsIndexData);

io.sockets.on('connection', function (socket) {
	console.log('connection');
	socket.emit('connected', { status: 'ok' });

	socket.on('createNode', function (label,done) {
		console.log("create server:"+label);
		var lastAttributedId = parseInt(fs.readFileSync(graphRepo+'/lastAttributedId.txt',{encoding:'utf8'}));
		lastAttributedId++;	
		fs.writeFileSync(graphRepo+'/lastAttributedId.txt',lastAttributedId);
		var node = { id : lastAttributedId, label: label, neighboursIds: [] };
		serializeNode(graphRepo,node,function(err) {
			if(err) throw err;
			done(node);
		});
	});

	socket.on('getNode', function (request,done) {
		var nodeId = request.nodeId;
		deserializeNode(graphRepo,nodeId,function(err,node) {
			if(err) throw err;
			done(node);
		});
	});
	socket.on('getNodeData', function(request,done) {
		var nodeId = request.nodeId;
		deserializeNodeData(graphRepo,nodeId,function(err,data) {
			//if(err) throw err;
			if(err) console.log(err);
			done(data);
		});
	});
	socket.on('getNodeFiles', function(request,done) {
		var nodeId = request.nodeId;
		deserializeNodeFiles(graphRepo,nodeId,function(err,filesNames) {
			//if(err) throw err;
			if(err) console.log(err);
			done(err,{nodeId:nodeId,filesNames:filesNames});
		});
	});
	socket.on('saveNodeData', function(request,done) {
		console.log('saveNodeData:'+request.nodeId);
		var nodeId = request.nodeId;
		var data = request.data;
		serializeNodeData(graphRepo,nodeId,data,function(err) {
			//if(err) throw err;
			if(err) console.log(err);
			done(err);
		});
	});
	socket.on('linkFilesWithNode',function(request,done) {
		console.log('linkFilesWithNode:'+request.nodeId);
		var nodeId = request.nodeId;
		var filesNames = request.filesNames;
		serializeNodeFiles(graphRepo,nodeId,filesNames,function(err) {
			//if(err) throw err;
			if(err) console.log(err);
			done(err,{nodeId:nodeId,filesNames:filesNames});
		});

	});
	socket.on('getNeighbours', function (request,done) {
		var nodeId = request.nodeId;
		//TODO
		//var graphRepo = request.graphRepo;

		deserializeNode(graphRepo,nodeId,function(err,node) {
			if(err) {
				console.log(err);
			}
			else {
				var neighbours = [];
				deserializeNodes(graphRepo,node.neighboursIds,0,neighbours,function(err,nodes) {
					done({nodeId:nodeId,nodes:nodes});
				});
			}
		});
	});
	socket.on('linkNodes', function (request,done) {
		var nodeId1 = request.nodeId1;
		var nodeId2 = request.nodeId2;

		deserializeNode(graphRepo,nodeId1,function(err,node) {
			debugger;
			if(err) {
				if(err.code === 'ENOENT') {
					if(nodeId1 === 'favorites' || nodeId1 === 'context') {
						var path = graphRepo+'/' + nodeId1 + '.json';
						fs.open(path,'wx', function(err,fd) {
							if(err) { console.log(err);return; };
							fs.close(fd,function(err) {
								if(err) { console.log(err);return; };
								serializeNode(graphRepo,{id:nodeId1,neighboursIds:[nodeId2]},function(err) {
									if(err) { console.log(err);return; };
									done({id:nodeId1,neighbours:[nodeId2]});
								});
							});
						});
					}
				}
				else {
					throw(err);	
				}
				return;
			}

			node.neighboursIds.push(nodeId2);	
			serializeNode(graphRepo,node,function(err) {
				done(node);
			});
		});
	});
	socket.on('unlinkNode', function (request,done) {
		var parentNodeId = request.parentNodeId;
		var nodeId = request.nodeId;
		console.log("unlinking "+parentNodeId+"->"+nodeId);
		deserializeNode(graphRepo,parentNodeId,function(err,node) {
			if(err) throw err;
			for(var i = 0 ; i < node.neighboursIds.length ; i++) {
				console.log("comparing "+nodeId +" with "+node.neighboursIds[i]);
				if(node.neighboursIds[i] == nodeId) {
					console.log("equal");
					node.neighboursIds.splice(i,1);
					break;
				}
			}
			serializeNode(graphRepo,node,function(err) {
				done();
			});
		});
	});
	socket.on('dataSearch', function(aRequest,done) {
		console.log('dataSearch');
		if(!aRequest.request) {
			done([]);
			return;
		}
		var words = splitInWords(aRequest.request);
		var dataResults = dataIndex[words[0].toLowerCase()];
		if(!dataResults) {
			dataResults = [];
		}
		var labelsResults = labelsIndex[words[0].toLowerCase()];
		if(!labelsResults) {
			labelsResults = [];
		}
		debugger;
		var results = dataResults.concat(labelsResults);
		deserializeNodes(graphRepo,results,0,[],function(err,nodes) {
			if(err) {
				console.log(err);
				return;
			}

			done(nodes);
		});
	});
});

var splitRegExp = /\w+/g;
function splitInWords(data) {
	var words = data.match(splitRegExp);
	return words;
}

function deserializeNodes(graphRepo,nodesIds,i,nodes,done) {
	if(nodesIds == undefined || i >= nodesIds.length) {
		done(null,nodes);
		return;
	}

	deserializeNode(graphRepo,nodesIds[i],function(err,node) {
		if(err) {
			throw err;
		}
		else {
			nodes.push(node);
			deserializeNodes(graphRepo,nodesIds,++i,nodes,done);
		}	
	});
}

function deserializeNode(graphRepo,nodeid,done) {
	var file = graphRepo+'/'+nodeid+'.json';
	fs.readFile(file,function(err,data) {
		if(err) {
			done(err,null);
			return;
		}
		var node = JSON.parse(data);
		done(null,node);
	});
}

function deserializeNodeData(graphRepo,nodeid,done) {
	var file = graphRepo+'/data/'+nodeid+'.txt';
	fs.readFile(file,{encoding:'utf8'},function(err,data) {
		if(err) {
			done(err,null);
			return;
		}
		done(null,data);
	});
}
function deserializeNodeFiles(graphRepo,nodeid,done) {
	var file = graphRepo+'/files/'+nodeid+'.json';
	fs.readFile(file,{encoding:'utf8'},function(err,files) {
		if(err) {
			done(err,null);
			return;
		}
		var filesNames = JSON.parse(files); 
		done(null,filesNames);
	});
}

function serializeNode(graphRepo,node,done) {
	var file = graphRepo+'/'+node.id+'.json';
	fs.writeFile(file,JSON.stringify(node),function(err) {
		done(err);
	});
}
function serializeNodeData(graphRepo,nodeId,data,done) {
	var file = graphRepo+'/data/'+nodeId+'.txt';
	fs.writeFile(file,data,{encoding:'utf8'},function(err) {
		done(err);
	});
}
function serializeNodeFiles(graphRepo,nodeId,filesNames,done) {
	var file = graphRepo+'/files/'+nodeId+'.json';
	var data = JSON.stringify(filesNames);
	fs.writeFile(file,data,{encoding:'utf8'},function(err) {
		done(err);
	});
}
