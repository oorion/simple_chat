var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');
var SimpleChatServer = require("./simple_chat_server");


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
