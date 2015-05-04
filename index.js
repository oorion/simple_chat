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
  console.log('user connected');
  socket.on('disconnect', function(){
    waitingUsers.splice(waitingUsers.indexOf(_.find(waitingUsers, function(usernameSocket) {
      return usernameSocket.rString === currentRandomString;
    })), 1);
    console.log('user disconnected');
  });

  socket.on('waiting', function(rString) {
    currentRandomString = rString;
    if (waitingUsers.length > 1) {
      waitingUsers = _.reject(waitingUsers, function(e) {
        return e.rString === currentRandomString;
      });
      var otherUser = waitingUsers.splice(_.random(0, waitingUsers.length - 1), 1)[0];
      this.emit('new-connection', currentRandomString);
      otherUser.socket.emit('new-connection', currentRandomString);
    } else {
      waitingUsers.push(new UsernameSocket(currentRandomString, this));
      console.log("waitingUsers: ");
      console.log(waitingUsers);
    }
  });

  socket.on('next', function(rString) {
    console.log("after next is clicked: ");
    console.log(socket.id);

    //pseudo code:
    //add the new UsernameSocket object on the waitingUsers array?
    //do the same work that I did in the waiting event above (possibly pull it out to a function)
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
