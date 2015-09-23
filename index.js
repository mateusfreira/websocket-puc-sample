var ws = require("nodejs-websocket")
var all = [];
var atleticanos = [];
var cruzerences = [];
var scores = {
	atleticanos : 0,
	cruzerences : 0	
}
// Scream server example: "hi" -> "HI!!!"
var notifyUsers = function(){
	all.forEach(function(conn){
		conn.sendText(JSON.stringify({
			'event' : 'connections',
			'data' : {
				atleticanos : atleticanos.length,
				cruzerences : cruzerences.length,
				scores : scores
			}
		}));
	});
}
var serverFlow = {
	"score" : function(conn, data){
		if(conn.team){
			scores[conn.team]++;
		}
		notifyUsers();
	},
	"atleticoConnect" : function(conn, data){
		conn.team = "atleticanos";
		atleticanos.push(conn);
		notifyUsers();
	},
	"cruzeirenseConnect" : function(conn, data){
		conn.team = "cruzerences";
		cruzerences.push(conn);
		notifyUsers();
	},
	"disconect"	 : function(conn, data){
		var index = atleticanos.indexOf(conn);
		if(index){			
			atleticanos.splice(index,1);
		}  else{
			index = cruzerences.indexOf(conn);	
			if(index)
				cruzerences.splice(index,1);
		}
		index = all.indexOf(conn);	
		all.splice(index,1);
		notifyUsers();
	}
};
var server = ws.createServer(function (conn) {
	all.push(conn);
    console.log("New connection")
    conn.on("text", function (str) {
    	var obj = JSON.parse(str);
    	console.log(obj);
		var func = serverFlow[obj.event];
		if(func){
			func(conn, obj);
		}
    });
    conn.on("close", function (code, reason) {
    	serverFlow.disconect(conn, {});
    });

}).listen(8001)

var static = require('node-static');
var file = new static.Server('./web');
 
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        // 
        // Serve files! 
        // 
        file.serve(request, response);
    }).resume();
}).listen(8082);