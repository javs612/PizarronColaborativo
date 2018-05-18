
var express = require('express');
var aux = [];
var app = express();
var server = app.listen(3000);

app.use(express.static('public'));
console.log("my Socket Server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
	console.log('new connection : ' + socket.id);
	socket.broadcast.emit('newWindow',aux);
	socket.on('mouse',mouseMsg);
	socket.on('addFig',addData);

	function mouseMsg(data){
		socket.broadcast.emit('temp',data);
	}

	function addData(data) {
		aux = data;
		socket.broadcast.emit('masFig',aux);
	}



}