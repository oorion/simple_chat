var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var waitingUsers = [];

function UsernameSocket(rString, socket) {
  this.rString = rString;
  this.socket = socket;
}

io.on('connection', function(socket){
  var currentRandomString = "";

  socket.on('disconnect', function(){
    waitingUsers.splice(waitingUsers.indexOf(_.find(waitingUsers, function(usernameSocket) {
      return usernameSocket.rString === currentRandomString;
    })), 1);
  });

  socket.on('waiting', function(rString) {
    currentRandomString = rString;

    var existsOnWaitingUsers = _.find(waitingUsers, function(e) {
      return e.socket.id == socket.id;
    });

    if (!existsOnWaitingUsers) {
      waitingUsers.push(new UsernameSocket(currentRandomString, this));
    }

    if (waitingUsers.length > 1) {
      waitingUsers = _.reject(waitingUsers, function(e) {
        return e.rString === currentRandomString;
      });
      var otherUser = waitingUsers.splice(_.random(0, waitingUsers.length - 1), 1)[0];
      this.emit('new-connection', currentRandomString);
      otherUser.socket.emit('new-connection', currentRandomString);
    }
  });
});

http.listen(process.env.PORT, function(){
  console.log('listening on *:3000');
});
