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

app.get('/js/client.js', function(req, res){
  res.sendFile(__dirname + '/js/client.js');
});

app.get('/css/styles.css', function(req, res){
  res.sendFile(__dirname + '/css/styles.css');
});

io.on('connection', function(socket){
  var user = new User("", socket);
  userPipeline.addUser(user);
  //socket.emit('connect', 'you connected');

  socket.on('waiting', function(data) {
    var randomString = data[0];
    user.zipcode = data[1];
    user.randomString = randomString;

    if (userPipeline.usersAvailable(user)) {
      var randomUser = userPipeline.selectRandomUser(user);
      randomUser.randomString = randomString;
      user.socket.emit('new-connection', randomString);
      randomUser.socket.emit('new-connection', randomString);
    }
  });

  socket.on('disconnect', function(){
    userPipeline.removeUser(user);
  });
});

//http.listen(process.env.PORT, function(){
  //console.log('listening on port ' + process.env.PORT);
//});

http.listen(5000, function(){
  console.log('listening on port 5000');
});
