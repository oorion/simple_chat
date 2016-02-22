fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');
var SimpleChatServer = require("./simple_chat_server");

secretsFilePath = "./secrets.json";
secrets = require(secretsFilePath);

app.get('/index', function(req, res){
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

  socket.on('assign-geolocation', function(geolocation) {
    user.assignGeolocation(geolocation);
    socket.emit("geolocation-set");
  });

  socket.on('waiting', function(data) {
    server.userIsReady(user, {channelId: data})
  });

  socket.on('disconnect', function(){
    server.destroyUser(user);
  });
});

// Github oauth
var oauth2 = require('simple-oauth2')({
  clientID: secrets.clientID,
  clientSecret: secrets.clientSecret,
  site: 'https://github.com/login',
  tokenPath: '/oauth/access_token',
  authorizationPath: '/oauth/authorize'
});
 
// Authorization uri definition 
var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: 'http://localhost:3000/callback',
  scope: 'notifications',
  state: '3(#0/!~'
});
 
// Initial page redirecting to Github 
app.get('/auth', function (req, res) {
    res.redirect(authorization_uri);
});
 
// Callback service parsing the authorization token and asking for the access token 
app.get('/callback', function (req, res) {
  var code = req.query.code;
 
  oauth2.authCode.getToken({
    code: code,
    redirect_uri: 'http://localhost:3000/callback'
  }, saveToken);
 
  function saveToken(error, result) {
    if (error) { console.log('Access Token Error', error.message); }
    token = oauth2.accessToken.create(result);
  }

  res.redirect("/index");
});
 
app.get('/', function (req, res) {
  res.send('Hello<br><a href="/auth">Log in with Github</a>');
});
 
http.listen(3000, function(){
  console.log('listening on port 3000');
});

//http.listen(process.env.PORT, function(){
  //console.log('listening on port ' + process.env.PORT);
//});

