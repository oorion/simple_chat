var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');
var UserPipeline = require('./user_pipeline');
var User = require('./user');
var util = require("util");

var SimpleChatServer = function() {
  this.userPipeline = new UserPipeline;
}

SimpleChatServer.prototype.createUser = function(connectCallback) {
  var user = new User("", connectCallback);
  this.userPipeline.addUser(user);
  return user;
}

SimpleChatServer.prototype.userIsReady = function(user, attributes) {
  user.zipcode      = attributes.zipcode;
  user.randomString = attributes.channelId;

  if (this.userPipeline.usersAvailable(user)) {
    var randomUser = this.userPipeline.selectRandomUser(user);
    randomUser.randomString = attributes.channelId;
    user.connectCallback(attributes.channelId);
    randomUser.connectCallback(attributes.channelId);
  }
}

SimpleChatServer.prototype.destroyUser = function(user) {
  this.userPipeline.removeUser(user);
}



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/js/client.js', function(req, res){
  res.sendFile(__dirname + '/js/client.js');
});

app.get('/css/styles.css', function(req, res){
  res.sendFile(__dirname + '/css/styles.css');
});

var server = new SimpleChatServer();
io.on('connection', function(socket){
  var user = server.createUser(function(channelId) {
    socket.emit('new-connection', channelId);
  });

  socket.on('waiting', function(data) {
    server.userIsReady(user, {channelId: data[0], zipcode: data[1]})
  });

  socket.on('disconnect', function(){
    server.destroyUser(user);
  });
});

//http.listen(process.env.PORT, function(){
  //console.log('listening on port ' + process.env.PORT);
//});

http.listen(5000, function(){
  console.log('listening on port 5000');
});
