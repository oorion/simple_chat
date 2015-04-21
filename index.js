var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var userNames = [];

io.on('connection', function(socket){
  var currentName = "";
  userNames.forEach(function(name) {
    socket.emit('name-added', name);
  });
  console.log('a user connected');
  socket.on('disconnect', function(){
    userNames.splice(userNames.indexOf(currentName), 1);
    io.emit('name-removed', currentName);
    console.log('user disconnected');
  });

  socket.on('name-added', function(newName){
    console.log(newName);
    currentName = newName;
    userNames.push(newName);
    io.emit('name-added', newName);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
