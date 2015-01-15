var http = require ('http'),
	connect = require ('connect'),
	path = require ('path'),
	app = connect ();

var handlerTable = [
	{ rules : [ /^echo$/, /^.*$/ ], handler : function (req, resp) { return 'You say ' + this [1]; }, name : 'Echo Service Handler' }
];

//Url parsing
app.use (function (req, resp, next) {
	var arr = req.url.split ('/').slice (1);
	if (arr [arr.length -1] === '') arr.pop ();
	var lastPath = arr [arr.length - 1];
	lastPath = lastPath.replace (/\?.*/, '');
	console.log ('[Server] pathContext : ' + arr);
	req.pathContext = arr;	
	next ();	
});

//Main request handler (Dispatcher controller)
app.use (function (req, resp) {
	lookupAndEnd (handlerTable, req, resp);
}).listen (1337, '127.0.0.1');

var lookupAndEnd = function (tbl, req, resp) {
	console.log ('Let\' lookup the handler');
	for (var i = 0; i < tbl.length; i++) {
		var rules = tbl [i].rules;
		var accept = true;
		for (var j = 0; j < rules.length; j++) {
			accept = rules [j].test (req.pathContext [j]);
			if (!accept) break;
		}
		if (accept) {
			console.log ('[Server] lookup succeed : ' + tbl [i].name);
			resp.writeHead (200, {'Content-Type' : 'text/html'});
			resp.end (tbl [i].handler.call (req.pathContext, req, resp));
			break;
		}		
	}
	if (!req.finished) {
		console.log ('[Server] lookup faild 404');
		resp.writeHead (404);
		resp.end ('Page was not found.');
	}
}





