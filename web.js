var express = require('express');

var fs = require('fs');
var infile = "index.html"; 
var buf = new Buffer(30); 
var text = fs.readFileSync(infile,'utf8');
buf.write(text,"utf-8");
var app = express.createServer(express.logger());

app.get('/', function(request, response) {
    response.send(buf.toString('utf-8',0,text.length));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
