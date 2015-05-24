var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');
var UserPipeline = require('./user_pipeline');
var User = require('./user');

var userPipeline = new UserPipeline;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var user = new User("", socket);
  userPipeline.addUser(user);

  socket.on('waiting', function(randomString) {
    user.randomString = randomString;

    if (userPipeline.length() > 1) {
      var randomUser = userPipeline.selectRandomUser(user);

      //emit new-connection to both users
      user.socket.emit('new-connection', user.randomString);
      randomUser.socket.emit('new-connection', user.randomString);
    }

    console.log('waitingUsers channels: ');
    console.log(_.map(userPipeline.waitingUsers, function(user) {
      return user.randomString;
    }));
  });

  socket.on('disconnect', function(){
    userPipeline.removeUser(user);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

//http.listen(process.env.PORT, function(){
  //console.log('listening on *:3000');
//});
