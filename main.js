var express = require('express');
var http = require('http');
var socketio = require('socket.io');

Error.stackTraceLimit = Infinity;

const colors = [
	'red', 'black', 'blue', 'purple', 'orange', 'magenta'
];

var colorPool = colors.slice();

function getNewColor() {
	if (colorPool.length == 0) {
		colorPool = colors.slice();
	}
	var index = Math.floor(colorPool.length * Math.random());
	var color = colorPool[index];
	colorPool.splice(index, 1);
	return color;
}

var app = express();
var server = http.Server(app);

app.use('/', express.static('static'));
app.use('/extern', express.static('extern'));
app.use('/scripts', express.static('scripts'));
app.use('/styles', express.static('styles'));

var paths = [];
var clients = {};
var serverSocket = socketio(server);

serverSocket.on('connection', function(socket) {

	console.log('client connected');

	clients[socket.id] = {socket: socket, color: getNewColor()}; // Add to color registry

	socket.emit('welcome', {
		color: clients[socket.id].color, // Tell client assigned color
		history: paths // Tell client history of drawing
	}); 

	socket.on('disconnect', function() {
		console.log('client disconnected');
		colorPool.push(clients[this.id].color); // Put color back in pool
		delete clients[this.id]; // Remove socket from registry

	});

	socket.on('pathFinished', function(path) {
		console.log('received path finished');
		paths.push(path);
		for (socketId in clients) {
			if (socketId != this.id) { // For all sockets EXCEPT this one...
				clients[socketId].socket.emit('pathCreated', path); // ... say that a new path was made
			}
		}
	})

});

server.listen(8080, function() {
	console.log('Listening');
});